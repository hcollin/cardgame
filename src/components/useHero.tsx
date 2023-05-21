import Hero from "../game/Hero";
import useClassData from "../utils/observable/useClassData";



export default function useHero(origHero: Hero): [Hero|null, ((h: Hero) => void)] {

    const heroWrapper = useClassData<Hero>(origHero);

    function updateHero(h: Hero) {
        heroWrapper.set(h);
    }

    const h = heroWrapper.instance;
    return [h, updateHero];

}