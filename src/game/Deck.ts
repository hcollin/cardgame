import { shuffle } from "rndlib";
import { CARDFLAGS, Card } from "../models/Card";

export class Deck {
	private deck: Card[] = [];
	private discard: Card[] = [];

	private removedFromGame: Card[] = [];

	private fullDeckSize: number = 0;

	constructor(cards: Card[]) {
		this.deck = cards;
		this.fullDeckSize = cards.length;
	}

	public deckSize(): number {
		return this.deck.length;
	}

	public getFullDeckSize(): number {
		return this.fullDeckSize;
	}

	public discardSize(): number {
		return this.discard.length;
	}

	// Draw a card from the deck
	public drawCard(): Card | undefined {
		return this.deck.shift();
	}

	// Draw multiple cards from the deck
	public drawCards(count: number, reshuffleDiscard = true): Card[] {
		const cards: Card[] = [];
		for (let i = 0; i < count; i++) {
			const card = this.drawCard();
			if (card) {
				cards.push(card);
			} else {
				if (reshuffleDiscard) {
					this.returnDiscardToDeck();
					const card = this.drawCard();
					if (card) {
						cards.push(card);
					}
				}
			}
		}
		return cards;
	}

	public shuffleDeck(): void {
		this.deck = shuffle(this.deck);
	}

	public putCardsOnBottom(cards: Card[]): void {
		this.deck = this.deck.concat(cards);
	}

	public discardCards(cards: Card[]): void {
		cards.forEach((c) => {
			if(c.flags && c.flags.includes(CARDFLAGS.SINGLEUSE)) {
				this.removeFromGame([c]);
			} else {
				this.discard.push(c);
			}
		})
		// this.discard = this.discard.concat(cards);
	}

	public removeFromGame(cards: Card[]): void {
		this.removedFromGame = this.removedFromGame.concat(cards);
	}

	public returnDiscardToDeck(): void {
		this.deck = this.deck.concat(this.discard);
		this.shuffleDeck();
		this.discard = [];
	}

	public addCards(cards: Card[]): void {
		this.deck = this.deck.concat(cards);
	}

	public calculateFullSize(): void {
		this.fullDeckSize = this.deck.length + this.discard.length;
	}
}
