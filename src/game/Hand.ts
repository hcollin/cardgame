import { Card } from "../models/Card";
import { GameState } from "../models/GameState";
import { Deck } from "./Deck";


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

    public drawNewHand(gs: GameState): GameState {
        
        
        this.discardAll(gs);
        const deck = this.getDeck(gs);
        this.calculateHandSize(gs);
        this.cards = deck.drawCards(this.handSize);
    
        return { ...gs };
    }

    public drawCards( gs: GameState, amount = 1): GameState {
        const deck = this.getDeck(gs);
        const cards = deck.drawCards(amount);
        this.cards = this.cards.concat(cards);
        return { ...gs };
    }

    public hasCard(card: Card): boolean {
        return this.cards.includes(card);
    }

    public discardAll(gs: GameState): GameState {
        const deck = this.getDeck(gs);
        deck.addCards(this.cards);
        this.cards = [];
        return { ...gs };
    }

    public playCard(card: Card, gs: GameState): GameState {
        this.cards = this.cards.filter(c => c.id !== card.id);
        return { ...gs };
    }

    public discardCard(card: Card, gs: GameState): GameState {
        const deck = this.getDeck(gs);
        deck.discardCards([card])
        return { ...gs };
    }

    public discardRandomCard(gs: GameState): GameState {

        return { ...gs };
    }

    private getDeck(gs: GameState) {
        return this.hand === "RIGHT" ? gs.rightHandDeck : gs.leftHandDeck;
    }

    private calculateHandSize(gs: GameState) {
        this.handSize = gs.hero.getHandSize(this.hand);
    }

}