# Frost Troll Quest

A deck building rpg adveture game inspired by 'Slay the Spire'.

## Known issues

* Does not work on Firefox as it does not yet support native css nesting.
  - This can be fixed by changing to sass on nesting parts.
* Lack of content
  - This is a work in progress
* Does not work on Mobile, yet
* There is only one area

## Balancing

At the current state (14.5.2023) the game has no balance. The items are way too powerful. To sort this issue some ground rules needs to be set. 

### Damage 

By playing an attack card, how much damage it should inflict? Maybe we should take the Short Sword Slash attack as the base level. That means 4 damage with 2 energy. Some weapons will deal less, but can have other effects and so on. Rarer cards can cause more damage.

Other approach to calculating damage is to calculate how much damage each weapon can inflict if player spends all of his energy playing attack cards. For Example: Long Swords Slash attack can cause 8 damage with 3 energy, which is a significant boost to default damage per energy ratio, but when player starts with 4 energy per turn they cannot play more than one of these cards per turn.

### Armor/Block & Damage Reduction

At the moment player can gain quite a lot of automatic armor per turn and as most enemies hit fairly weakly this can become highly unbalanced fairly quickly. Most body armors should provide maybe more damage reduction instead of block at least when they are heavier. Also each enemy should hit for more. Currently they are too easy.



