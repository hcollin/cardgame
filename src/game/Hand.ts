import { arnd, rnd } from "rndlib";
import { Card } from "../models/Card";

import { Deck } from "./Deck";
import { ArenaState } from "../models/ArenaState";


export class Hand {

    private cards: Card[] = [];
    public readonly hand: "RIGHT" | "LEFT" = "RIGHT";

    private handSize: number = 3;

    constructor(hand: "RIGHT" | "LEFT") {
        this.hand = hand;
    }

    public getCards(): Card[] {
        return this.cards;
    }

    public getHandSize(): number {
        return this.handSize;
    }

    public drawNewHand(as: ArenaState): ArenaState {
        this.discardAll(as);
        const deck = this.getDeck(as);
        this.calculateHandSize(as);
        this.cards = deck.drawCards(this.handSize);
        return { ...as };
    }

    public drawCards(as: ArenaState, amount = 1): ArenaState {
        const deck = this.getDeck(as);
        const cards = deck.drawCards(amount);
        this.cards = this.cards.concat(cards);
        return { ...as };
    }

    public hasCard(card: Card): boolean {
        return this.cards.includes(card);
    }

    public discardAll(as: ArenaState): ArenaState {
        const deck = this.getDeck(as);
        deck.discardCards([...this.cards]);
        this.cards = [];
        return { ...as };
    }

    public discardCard(card: Card, as: ArenaState): ArenaState {
        const deck = this.getDeck(as);
        deck.discardCards([card])
        this.cards = this.cards.filter(c => c.id !== card.id);
        return { ...as };
    }

    public discardRandomCard(as: ArenaState): ArenaState {
        const card = arnd(this.cards);
        return this.discardCard(card, as);
    }

    private getDeck(as: ArenaState) {
        return this.hand === "RIGHT" ? as.rightHandDeck : as.leftHandDeck;
    }

    private calculateHandSize(as: ArenaState) {
        this.handSize = as.hero.getHandSize(this.hand);
        const deckSize = this.getDeck(as).getFullDeckSize();
        if (this.handSize > deckSize) {
            this.handSize = deckSize;
        }
    }

}