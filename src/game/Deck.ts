import { shuffle } from "rndlib";
import { Card, OldCardData } from "../models/Card";

export class Deck {
	private deck: Card[] = [];
    private discard: Card[] = [];

	constructor(cardSet: OldCardData[]) {
		
        this.deck = cardSet.map((card, index) => {
            return {...card, id: `card-${index}}`};
        });
        
	}

    public deckSize(): number {
        return this.deck.length;
    }

    public discardSize(): number {
        return this.discard.length;
    }

	// Draw a card from the deck
	public drawCard(): Card | undefined {
		return this.deck.shift();
	}

    // Draw multiple cards from the deck
    public drawCards(count: number, reshuffleDiscard=true): Card[] {
        const cards: Card[] = [];
        for (let i = 0; i < count; i++) {
            const card = this.drawCard();
            if (card) {
                cards.push(card);
            } else {
                if(reshuffleDiscard) {
                    this.returnDiscardToDeck();
                    const card = this.drawCard();
                    if(card) {
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
        this.discard = this.discard.concat(cards);
    }

    public returnDiscardToDeck(): void {
        this.deck = this.deck.concat(this.discard);
        this.shuffleDeck();
        this.discard = [];
    }

    
}