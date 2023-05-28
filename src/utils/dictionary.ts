import { arnd, rnd } from "rndlib";

export interface Word {
	word: string;
	groups: string[];
	rarity: number;
	genitive?: string;
	plural?: string;
	comparative?: string;
	superlative?: string;
	continues?: string;
	past?: string;
	edparticiple?: string;
}

export enum WordForm {
	BASIC = "basic",
	GENITIVE = "genitive",
	PLURAL = "plural",
	COMPARATIVE = "comparative",
	SUPERLATIVE = "superlative",
	CONTINUES = "continues",
	PAST = "past",
	EDPARTICIPLE = "edparticiple",
}

// export interface NameFormatRules {
// 	format: string;
// 	filters: string[] | string[][];
// }

type Rules = { format: string; filters: string[] | string[][] };

// export function generateName(rules: NameFormatRules|NameFormatRules[]): string {

/**
 * Generate a name from a format string
 *
 * The format string can contain the following tokens:
 * %s = subjective with added p or g for plural or genitive forms
 * %t = type with added p or g for plural or genitive forms
 * %i = item with added p or g for plural or genitive forms
 * %a = for adjective with added c or s for comparative or superlative forms
 * %v = for verb with added p, c or e for past, continues or ed participle forms
 * %c = for custom word. This word is provided by the filters
 *
 *  Here are a few examples:
 *  %sg %t
 *  %sg %a %i
 *
 *  The filters are used to filter the words from the dictionary. The filters can be a string array or a array of string arrays.
 *  The filters are used in the order they are given. The first filter is used to filter the subjective form of the word, the second filter is used to filter the type of the word and the third filter is used to filter the item.
 *  If only one filter array is given, it is used to filter all tokens.
 *
 * @param rules
 * @param filters
 * @returns
 */
export function dictionaryNameGenerator(rules: Rules[] | string, filters?: string[] | string[][]): string {
	// Format string rules
	// %s = subjective
	// %sp = subjective plural
	// %sg = subjective genitive
	// %t = type
	// %tp = type plural
	// %tg = type genitive
	// %i - object aka item
	// %ip - object aka item plural
	// %ig - object aka item genitive
	// %a - any adjective
	// %ac - any comparitive adjective
	// %as - any superlative adjective
	// %v - any verb
	// %vp - any verb past tense
	// %vc - any verb continues
	// %ve - any verb ed participle

	// find all % tokens from format string

	const allRules = Array.isArray(rules) ? rules : [{ format: rules, filters: filters || [] }];

	const chosenRule = arnd(allRules);

	const tokens = findTokensFromFormat(chosenRule.format);
	// console.log(chosenFormat, "\n", tokens);
	let name: string = chosenRule.format;

	// Check if the filters are a string array or a array of string array

	tokens.forEach((token, i) => {
		const f: string[] = getValidFilters(chosenRule.filters, i);
		if (token === "%i") {
			name = name.replace(token, tokenItem(f, WordForm.BASIC));
		}
		if (token === "%ig") {
			name = name.replace(token, tokenItem(f, WordForm.GENITIVE));
		}
		if (token === "%ip") {
			name = name.replace(token, tokenItem(f, WordForm.PLURAL));
		}
		if (token === "%s") {
			name = name.replace(token, tokenSubjective(f, WordForm.BASIC));
		}
		if (token === "%sg") {
			name = name.replace(token, tokenSubjective(f, WordForm.GENITIVE));
		}
		if (token === "%sp") {
			name = name.replace(token, tokenSubjective(f, WordForm.PLURAL));
		}
		if (token === "%v") {
			name = name.replace(token, tokenVerb(f, WordForm.BASIC));
		}
		if (token === "%vp") {
			name = name.replace(token, tokenVerb(f, WordForm.PAST));
		}
		if (token === "%vc") {
			name = name.replace(token, tokenVerb(f, WordForm.CONTINUES));
		}
		if (token === "%ve") {
			name = name.replace(token, tokenVerb(f, WordForm.EDPARTICIPLE));
		}
		if (token === "%a") {
			name = name.replace(token, tokenAdjective(f, WordForm.BASIC));
		}
		if (token === "%ac") {
			name = name.replace(token, tokenAdjective(f, WordForm.COMPARATIVE));
		}
		if (token === "%as") {
			name = name.replace(token, tokenAdjective(f, WordForm.SUPERLATIVE));
		}
		if (token === "%c") {
			name = name.replace(token, tokenCustom(f));
		}
	});

	return name;
}

/**
 * Parse filter options for the token
 *
 * @param filters
 * @param index
 * @returns
 */
function getValidFilters(filters: string[] | string[][], index: number): string[] {
	if (filters.length === 0) {
		return [];
	}
	if (typeof filters[0] === "string") {
		return filters as string[];
	}
	return filters[index] as string[];
}

/**
 * Parse tokens from format string
 *
 * @param format
 * @returns
 */
function findTokensFromFormat(format: string): string[] {
	return format.match(/%[a-z]+/g) || [];
}

export function getWordListFilterSplitter(filters: string[]): Word[] {
	const allFilters = generateCombinations(filters);
	const allWords = getWordListCombined(allFilters);
	return removeDuplicates(allWords);
}

function removeDuplicates(words: Word[]): Word[] {
	const temp = new Set();

	return words.filter((word) => {
		if (!temp.has(word.word)) {
			temp.add(word.word);
			return true;
		}

		return false;
	});
}

function generateCombinations(arr: string[]): string[][] {
	let result: string[][] = [];

	const recurse = (acc: string[], rest: string[]) => {
		if (rest.length === 0) {
			result.push(acc);
			return;
		}

		const [first, ...restFirstRemoved] = rest;
		if (first.includes("|")) {
			const splitStrings = first.split("|");
			for (let splitString of splitStrings) {
				recurse([...acc, splitString], restFirstRemoved);
			}
		} else {
			recurse([...acc, first], restFirstRemoved);
		}
	};

	recurse([], arr);
	return result;
}

/**
 * Return a random word from the provided list of filters
 *
 * @param filters
 * @returns
 */
function tokenCustom(filters: string[]): string {
	return ucFirst(arnd(filters));
}

/**
 * Return a random word from the dictionary for an Item
 *
 * Supports genitive and plural forms
 *
 * @param filters
 * @param form
 * @returns
 */
function tokenItem(filters: string[], form: WordForm): string {
	const words = getWordListFilterSplitter(["item", ...filters]);
	if (words.length === 0) {
		throw new Error("No item words found for filters: " + filters.join(", "));
	}
	if (form === WordForm.GENITIVE) {
		return ucFirst(arnd(words).genitive || arnd(words).word);
	}
	if (form === WordForm.PLURAL) {
		return ucFirst(arnd(words).plural || arnd(words).word);
	}
	return ucFirst(arnd(words).word);
}

/**
 * Return a random word from the dictionary for an Subjective
 *
 * Supports genitive and plural forms
 *
 * @param filters
 * @param form
 * @returns
 */
function tokenSubjective(filters: string[], form: WordForm): string {
	const word = getWordListFilterSplitter(["subjective", ...filters]);
	if (word.length === 0) {
		throw new Error("No subjective words found for filters: " + filters.join(", "));
	}
	try {
		if (form === WordForm.GENITIVE) {
			return ucFirst(arnd(word).genitive || arnd(word).word);
		}
		if (form === WordForm.PLURAL) {
			return ucFirst(arnd(word).plural || arnd(word).word);
		}
		return ucFirst(arnd(word).word);
	} catch (e) {
		console.error("WORD:", word);
		throw e;
	}
}
/**
 * Return a random word from the dictionary for an Verb
 *
 * Supports past, continues and ed participle forms
 *
 * @param filters
 * @param form
 * @returns
 */
function tokenVerb(filters: string[], form: WordForm): string {
	const words = getWordListFilterSplitter(["verb", ...filters]);
	if (words.length === 0) {
		throw new Error("No verb words found for filters: " + filters.join(", "));
	}
	const word = arnd(words);
	if (form === WordForm.PAST) {
		return ucFirst(word.past || word.word);
	}
	if (form === WordForm.CONTINUES) {
		return ucFirst(word.continues || word.word);
	}
	if (form === WordForm.EDPARTICIPLE) {
		return ucFirst(word.edparticiple || word.past || word.word);
	}
	return ucFirst(word.word);
}

/**
 * Return a random word from the dictionary for an Adjective
 *
 * Supports comparative and superlative forms
 *
 * @param filters
 * @param form
 * @returns
 */
function tokenAdjective(filters: string[], form: WordForm): string {
	const words = getWordListFilterSplitter(["adjective", ...filters]);
	if (words.length === 0) {
		throw new Error("No adjective words found for filters: " + filters.join(", "));
	}
	const word = arnd(words);
	if (word.groups.includes("verb")) {
		return ucFirst(word.edparticiple || word.past || tokenAdjective(filters, form));
	}
	if (form === WordForm.COMPARATIVE) {
		return ucFirst(word.comparative || word.word);
	}
	if (form === WordForm.SUPERLATIVE) {
		return ucFirst(word.superlative || word.word);
	}
	return ucFirst(word.word);
}

// Uppercase the first letter of a string
export function ucFirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getWordList(groups: string[]): Word[] {
	return dictionary.filter((w) => {
		return groups.every((g) => w.groups.includes(g));
	});
}

export function getWordListCombined(groups: string[][]): Word[] {
	return groups.reduce((strs: Word[], g: string[]) => {
		return strs.concat(getWordList(g));
	}, [] as Word[]);
}

export function getStringList(groups: string[], form?: WordForm): string[] {
	return dictionary.reduce((strs: string[], w: Word) => {
		if (groups.every((g) => w.groups.includes(g))) {
			if (form === WordForm.GENITIVE && w.genitive) {
				strs.push(w.genitive);
				return strs;
			}
			if (form === WordForm.PLURAL && w.plural) {
				strs.push(w.plural);
				return strs;
			}
			if (form === WordForm.COMPARATIVE && w.comparative) {
				strs.push(w.comparative);
				return strs;
			}
			if (form === WordForm.SUPERLATIVE && w.superlative) {
				strs.push(w.superlative);
				return strs;
			}
			strs.push(w.word);
		}
		return strs;
	}, [] as string[]);
}

export function getStringListCombined(groups: string[][], form?: WordForm): string[] {
	const dform = form || WordForm.BASIC;
	return groups.reduce((strs: string[], g: string[]) => {
		return strs.concat(getStringList(g, dform));
	}, [] as string[]);
}

const dictionary: Word[] = [
	// Human Male First Names
	{ word: "John", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "John's", plural: "Johns" },
	{ word: "Eric", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Eric's", plural: "Erics" },
	{ word: "William", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "William's", plural: "Williams" },
	{ word: "Henry", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Henry's", plural: "Henrys" },
	{ word: "Richard", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Richard's", plural: "Richards" },
	{ word: "Robert", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Robert's", plural: "Roberts" },
	{ word: "Thomas", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Thomas'", plural: "Thomases" },
	{ word: "Edward", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Edward's", plural: "Edwards" },
	{ word: "Geoffrey", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Geoffrey's", plural: "Geoffreys" },
	{ word: "Walter", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Walter's", plural: "Walters" },
	{ word: "Roger", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Roger's", plural: "Rogers" },
	{ word: "Hugh", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Hugh's", plural: "Hughs" },
	{ word: "Ralph", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Ralph's", plural: "Ralphs" },
	{ word: "Simon", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Simon's", plural: "Simons" },
	{ word: "Peter", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Peter's", plural: "Peters" },
	{ word: "Arnold", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Arnold's", plural: "Arnolds" },
	{ word: "Gilbert", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Gilbert's", plural: "Gilberts" },
	{ word: "Norman", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Norman's", plural: "Normans" },
	{ word: "Humphrey", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Humphrey's", plural: "Humphreys" },
	{ word: "Philip", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Philip's", plural: "Philips" },
	{ word: "Reginald", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Reginald's", plural: "Reginalds" },
	{ word: "Edmund", rarity: 1, groups: ["subjective", "person", "name", "human", "male", "first name"], genitive: "Edmund's", plural: "Edmunds" },

	// Fantasy male names
	{ word: "Aerindor", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Aerindor's", plural: "Aerindors" },
	{ word: "Bravilar", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Bravilar's", plural: "Bravilars" },
	{ word: "Caelthorn", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Caelthorn's", plural: "Caelthorns" },
	{ word: "Dornal", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Dornal's", plural: "Dornals" },
	{ word: "Erevan", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Erevan's", plural: "Erevans" },
	{ word: "Faelar", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Faelar's", plural: "Faelars" },
	{ word: "Gorstag", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Gorstag's", plural: "Gorstags" },
	{ word: "Haelis", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Haelis'", plural: "Haelises" },
	{ word: "Ilither", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Ilither's", plural: "Ilithers" },
	{ word: "Jareth", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Jareth's", plural: "Jareths" },
	{ word: "Kaelis", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Kaelis'", plural: "Kaelises" },
	{ word: "Lorindol", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Lorindol's", plural: "Lorindols" },
	{ word: "Morthil", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Morthil's", plural: "Morthils" },
	{ word: "Nolrim", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Nolrim's", plural: "Nolrims" },
	{ word: "Othorion", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Othorion's", plural: "Othorions" },
	{ word: "Paelias", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Paelias'", plural: "Paeliases" },
	{ word: "Quinlan", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Quinlan's", plural: "Quinlans" },
	{ word: "Raelis", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Raelis'", plural: "Raelises" },
	{ word: "Storlind", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Storlind's", plural: "Storlinds" },
	{ word: "Thalion", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "male", "first name"], genitive: "Thalion's", plural: "Thalions" },

	// Human Female First names
	{ word: "Laura", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Laura's", plural: "Lauras" },
	{ word: "Alice", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Alice's", plural: "Alices" },
	{ word: "Margaret", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Margaret's", plural: "Margarets" },
	{ word: "Elizabeth", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Elizabeth's", plural: "Elizabeths" },
	{ word: "Emma", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Emma's", plural: "Emmas" },
	{ word: "Beatrice", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Beatrice's", plural: "Beatrices" },
	{ word: "Eleanor", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Eleanor's", plural: "Eleanors" },
	{ word: "Agnes", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Agnes'", plural: "Agneses" },
	{ word: "Mabel", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Mabel's", plural: "Mabels" },
	{ word: "Cecily", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Cecily's", plural: "Cecilys" },
	{ word: "Matilda", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Matilda's", plural: "Matildas" },
	{ word: "Isabel", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Isabel's", plural: "Isabels" },
	{ word: "Joan", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Joan's", plural: "Joans" },
	{ word: "Anne", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Anne's", plural: "Annes" },
	{ word: "Lucy", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Lucy's", plural: "Lucys" },
	{ word: "Maud", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Maud's", plural: "Mauds" },
	{ word: "Constance", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Constance's", plural: "Constances" },
	{ word: "Evelyn", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Evelyn's", plural: "Evelyns" },
	{ word: "Edith", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Edith's", plural: "Ediths" },
	{ word: "Bridget", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Bridget's", plural: "Bridgets" },
	{ word: "Marian", rarity: 1, groups: ["subjective", "person", "name", "human", "female", "first name"], genitive: "Marian's", plural: "Marians" },

	// Fantasy Female names
	{ word: "Aerith", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Aerith's", plural: "Aeriths" },
	{ word: "Briseis", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Briseis'", plural: "Briseises" },
	{ word: "Caelia", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Caelia's", plural: "Caelias" },
	{ word: "Daelis", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Daelis'", plural: "Daelises" },
	{ word: "Elara", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Elara's", plural: "Elaras" },
	{ word: "Faelwen", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Faelwen's", plural: "Faelwens" },
	{
		word: "Galadriel",
		rarity: 1,
		groups: ["subjective", "person", "name", "fantasy", "female", "first name"],
		genitive: "Galadriel's",
		plural: "Galadriels",
	},
	{
		word: "Helisende",
		rarity: 1,
		groups: ["subjective", "person", "name", "fantasy", "female", "first name"],
		genitive: "Helisende's",
		plural: "Helisendes",
	},
	{ word: "Iliana", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Iliana's", plural: "Ilianas" },
	{ word: "Jaelith", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Jaelith's", plural: "Jaeliths" },
	{ word: "Kaelith", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Kaelith's", plural: "Kaeliths" },
	{ word: "Laelith", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Laelith's", plural: "Laeliths" },
	{ word: "Maelis", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Maelis'", plural: "Maelises" },
	{ word: "Naelia", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Naelia's", plural: "Naelias" },
	{ word: "Othelie", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Othelie's", plural: "Othelies" },
	{ word: "Paela", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Paela's", plural: "Paelas" },
	{
		word: "Quintessa",
		rarity: 1,
		groups: ["subjective", "person", "name", "fantasy", "female", "first name"],
		genitive: "Quintessa's",
		plural: "Quintessas",
	},
	{ word: "Raelith", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Raelith's", plural: "Raeliths" },
	{ word: "Saelith", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Saelith's", plural: "Saeliths" },
	{ word: "Thaelis", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "female", "first name"], genitive: "Thaelis'", plural: "Thaelises" },

	// English last names
	{ word: "Smith", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Smith's", plural: "Smiths" },
	{ word: "Johnson", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Johnson's", plural: "Johnsons" },
	{ word: "Williams", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Williams'", plural: "Williamses" },
	{ word: "Jones", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Jones'", plural: "Joneses" },
	{ word: "Brown", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Brown's", plural: "Browns" },
	{ word: "Davis", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Davis'", plural: "Davises" },
	{ word: "Miller", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Miller's", plural: "Millers" },
	{ word: "Wilson", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Wilson's", plural: "Wilsonses" },
	{ word: "Moore", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Moore's", plural: "Moores" },
	{ word: "Taylor", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Taylor's", plural: "Taylors" },
	{ word: "Anderson", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Anderson's", plural: "Andersons" },
	{ word: "Thomas", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Thomas'", plural: "Thomases" },
	{ word: "Jackson", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Jackson's", plural: "Jacksons" },
	{ word: "White", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "White's", plural: "Whites" },
	{ word: "Harris", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Harris'", plural: "Harrises" },
	{ word: "Martin", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Martin's", plural: "Martins" },
	{ word: "Thompson", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Thompson's", plural: "Thompsons" },
	{ word: "Garcia", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Garcia's", plural: "Garcias" },
	{ word: "Martinez", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Martinez's", plural: "Martinezes" },
	{ word: "Robinson", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Robinson's", plural: "Robinsons" },
	{ word: "Clark", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Clark's", plural: "Clarks" },
	{ word: "Rodriguez", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Rodriguez's", plural: "Rodriguezes" },
	{ word: "Lewis", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Lewis'", plural: "Lewises" },
	{ word: "Lee", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Lee's", plural: "Lees" },
	{ word: "Walker", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Walker's", plural: "Walkers" },
	{ word: "Hall", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Hall's", plural: "Halls" },
	{ word: "Allen", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Allen's", plural: "Allens" },
	{ word: "Young", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Young's", plural: "Youngs" },
	{ word: "Hernandez", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Hernandez's", plural: "Hernandezes" },
	{ word: "King", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "King's", plural: "Kings" },
	{ word: "Wright", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Wright's", plural: "Wrights" },
	{ word: "Lopez", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Lopez's", plural: "Lopezes" },
	{ word: "Hill", rarity: 1, groups: ["subjective", "person", "name", "english", "surname"], genitive: "Hill's", plural: "Hills" },

	// Fantasy human surnames

	{ word: "Dragonheart", rarity: 4, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Dragonheart's", plural: "Dragonhearts" },
	{ word: "Moonshade", rarity: 2, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Moonshade's", plural: "Moonshades" },
	{ word: "Thunderbrand", rarity: 3, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Thunderbrand's", plural: "Thunderbrands" },
	{ word: "Stonewalker", rarity: 3, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Stonewalker's", plural: "Stonewalkers" },
	{ word: "Wolfsbane", rarity: 2, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Wolfsbane's", plural: "Wolfsbanes" },
	{ word: "Lightbinder", rarity: 4, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Lightbinder's", plural: "Lightbinders" },
	{ word: "Skyrender", rarity: 5, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Skyrender's", plural: "Skyrenders" },
	{ word: "Fireforge", rarity: 3, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Fireforge's", plural: "Fireforges" },
	{ word: "Stormseeker", rarity: 3, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Stormseeker's", plural: "Stormseekers" },
	{ word: "Feywhisper", rarity: 5, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Feywhisper's", plural: "Feywhispers" },
	{ word: "Dawnwarden", rarity: 4, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Dawnwarden's", plural: "Dawnwardens" },
	{ word: "Starweaver", rarity: 4, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Starweaver's", plural: "Starweavers" },
	{ word: "Grimshadow", rarity: 2, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Grimshadow's", plural: "Grimshadows" },
	{ word: "Ironfist", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Ironfist's", plural: "Ironfists" },
	{ word: "Ravenshield", rarity: 3, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Ravenshield's", plural: "Ravenshields" },
	{ word: "Wyrmhunter", rarity: 5, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Wyrmhunter's", plural: "Wyrmhunters" },
	{ word: "Frostgale", rarity: 4, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Frostgale's", plural: "Frostgales" },
	{ word: "Sunwhisper", rarity: 3, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Sunwhisper's", plural: "Sunwhispers" },
	{ word: "Dreamthorn", rarity: 5, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Dreamthorn's", plural: "Dreamthorns" },
	{ word: "Eaglespire", rarity: 4, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Eaglespire's", plural: "Eaglespires" },
	{ word: "Oakenshield", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Oakenshield's", plural: "Oakenshields" },
	{ word: "Silvervein", rarity: 2, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Silvervein's", plural: "Silverveins" },
	{ word: "Crystalborn", rarity: 5, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Crystalborn's", plural: "Crystalborns" },
	{ word: "Windchaser", rarity: 3, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Windchaser's", plural: "Windchasers" },
	{ word: "Lionheart", rarity: 1, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Lionheart's", plural: "Lionhearts" },
	{ word: "Stormdrake", rarity: 4, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Stormdrake's", plural: "Stormdrakes" },
	{ word: "Thundersong", rarity: 5, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Thundersong's", plural: "Thundersongs" },
	{ word: "Greenmantle", rarity: 2, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Greenmantle's", plural: "Greenmantles" },
	{ word: "Brightaxe", rarity: 3, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Brightaxe's", plural: "Brightaxes" },
	{ word: "Swiftblade", rarity: 2, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Swiftblade's", plural: "Swiftblades" },
	{ word: "Shadowcrown", rarity: 5, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Shadowcrown's", plural: "Shadowcrowns" },
	{ word: "Rivermyst", rarity: 4, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Rivermyst's", plural: "Rivermysts" },
	{ word: "Quicksilver", rarity: 2, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Quicksilver's", plural: "Quicksilvers" },
	{ word: "Seaborn", rarity: 2, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Seaborn's", plural: "Seaborns" },
	{ word: "Dawnfire", rarity: 3, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Dawnfire's", plural: "Dawnfires" },
	{ word: "Gloomraven", rarity: 4, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Gloomraven's", plural: "Gloomravens" },
	{ word: "Emberfall", rarity: 5, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Emberfall's", plural: "Emberfalls" },
	{ word: "Stardust", rarity: 4, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Stardust's", plural: "Stardusts" },
	{ word: "Thunderclaw", rarity: 3, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Thunderclaw's", plural: "Thunderclaws" },
	{ word: "Nightbreeze", rarity: 2, groups: ["subjective", "person", "name", "fantasy", "surname"], genitive: "Nightbreeze's", plural: "Nightbreezes" },

	// Family words
	{ word: "Father", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Father's", plural: "Fathers" },
	{ word: "Mother", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Mother's", plural: "Mothers" },
	{ word: "Brother", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Brother's", plural: "Brothers" },
	{ word: "Sister", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Sister's", plural: "Sisters" },
	{ word: "Son", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Son's", plural: "Sons" },
	{ word: "Daughter", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Daughter's", plural: "Daughters" },
	{ word: "Uncle", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Uncle's", plural: "Uncles" },
	{ word: "Aunt", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Aunt's", plural: "Aunts" },
	{ word: "Cousin", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Cousin's", plural: "Cousins" },
	{ word: "Grandfather", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Grandfather's", plural: "Grandfathers" },
	{ word: "Grandmother", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Grandmother's", plural: "Grandmothers" },
	{ word: "Grandson", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Grandson's", plural: "Grandsons" },
	{ word: "Granddaughter", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Granddaughter's", plural: "Granddaughters" },
	{ word: "Nephew", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Nephew's", plural: "Nephews" },
	{ word: "Niece", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Niece's", plural: "Nieces" },
	{ word: "Husband", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Husband's", plural: "Husbands" },
	{ word: "Wife", rarity: 2, groups: ["subjective", "owner", "family"], genitive: "Wife's", plural: "Wives" },

	// Fantasy names
	{ word: "Aldor", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Aldor's", plural: "Aldors" },
	{ word: "Thistlehorn", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Thistlehorn's", plural: "Thistlehorns" },

	{ word: "Silvermoon", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Silvermoon's", plural: "Silvermoons" },
	{ word: "Ravenclaw", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Ravenclaw's", plural: "Ravenclaws" },
	{ word: "Goldengrove", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Goldengrove's", plural: "Goldengroves" },
	{ word: "Ironfoot", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Ironfoot's", plural: "Ironfoots" },
	{ word: "Stormwind", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Stormwind's", plural: "Stormwinds" },
	{ word: "Nightshade", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Nightshade's", plural: "Nightshades" },
	{ word: "Whisperwind", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Whisperwind's", plural: "Whisperwinds" },
	{ word: "Eagle Eye", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Eagle Eye's", plural: "Eagle Eyes" },
	{ word: "Frostbeard", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Frostbeard's", plural: "Frostbeards" },
	{ word: "Sunfire", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Sunfire's", plural: "Sunfires" },
	{ word: "Shadowfen", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Shadowfen's", plural: "Shadowfens" },
	{ word: "Riverstone", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Riverstone's", plural: "Riverstones" },
	{ word: "Brambleheart", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Brambleheart's", plural: "Bramblehearts" },
	{ word: "Lightbringer", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Lightbringer's", plural: "Lightbringers" },
	{ word: "Swiftwind", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Swiftwind's", plural: "Swiftwinds" },
	{ word: "Moonbeam", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Moonbeam's", plural: "Moonbeams" },
	{ word: "Starfall", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Starfall's", plural: "Starfalls" },
	{ word: "Ivorytower", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Ivorytower's", plural: "Ivorytowers" },
	{ word: "Hearthstone", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Hearthstone's", plural: "Hearthstones" },
	{ word: "Emeraldglade", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Emeraldglade's", plural: "Emeraldglades" },
	{ word: "Sapphiresea", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Sapphiresea's", plural: "Sapphireseas" },
	{ word: "Crystalpeak", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Crystalpeak's", plural: "Crystalpeaks" },
	{ word: "Duskwave", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Duskwave's", plural: "Duskwaves" },
	{ word: "Flameheart", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Flameheart's", plural: "Flamehearts" },
	{ word: "Dreamweaver", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Dreamweaver's", plural: "Dreamweavers" },
	{ word: "Stonestride", rarity: 4, groups: ["subjective", "owner", "fantasy"], genitive: "Stonestride's", plural: "Stonestrides" },

	// Store Names
	{ word: "Market", rarity: 2, groups: ["subjective", "location", "building", "general store"], genitive: "Market's", plural: "Markets" },
	{ word: "Shop", rarity: 2, groups: ["subjective", "location", "building", "general store"], genitive: "Shop's", plural: "Shops" },
	{ word: "Store", rarity: 2, groups: ["subjective", "location", "building", "general store"], genitive: "Store's", plural: "Stores" },
	{ word: "Bazaar", rarity: 2, groups: ["subjective", "location", "building", "general store"], genitive: "Bazaar's", plural: "Bazaars" },
	{ word: "Marketplace", rarity: 2, groups: ["subjective", "location", "building", "general store"], genitive: "Marketplace's", plural: "Marketplaces" },
	{ word: "Emporium", rarity: 2, groups: ["subjective", "location", "building", "general store"], genitive: "Emporium's", plural: "Emporiums" },
	{ word: "Boutique", rarity: 2, groups: ["subjective", "location", "building", "general store"], genitive: "Boutique's", plural: "Boutiques" },
	{ word: "Dry Goods", rarity: 2, groups: ["subjective", "location", "building", "general store"], genitive: "Dry Goods'", plural: "Dry Goods" },
	{ word: "Mercantile", rarity: 2, groups: ["subjective", "location", "building", "general store"], genitive: "Mercantile's", plural: "Mercantiles" },
	{ word: "Trading Post", rarity: 2, groups: ["subjective", "location", "building", "general store"], genitive: "Trading Post's", plural: "Trading Posts" },
	{ word: "Outfitters", rarity: 2, groups: ["subjective", "location", "building", "general store"], genitive: "Outfitters'", plural: "Outfitters" },

	// General Buidlings
	{ word: "House", rarity: 2, groups: ["subjective", "building", "house", "neutral"], genitive: "House's", plural: "Houses" },
	{ word: "Home", rarity: 2, groups: ["subjective", "building", "house", "neutral"], genitive: "Home's", plural: "Homes" },
	{ word: "Cottage", rarity: 2, groups: ["subjective", "building", "house", "neutral"], genitive: "Cottage's", plural: "Cottages" },
	{ word: "Hut", rarity: 2, groups: ["subjective", "building", "house", "negative"], genitive: "Hut's", plural: "Huts" },
	{ word: "Shack", rarity: 2, groups: ["subjective", "building", "house", "negative"], genitive: "Shack's", plural: "Shacks" },
	{ word: "Shed", rarity: 2, groups: ["subjective", "building", "house", "negative"], genitive: "Shed's", plural: "Sheds" },
	{ word: "Cabin", rarity: 2, groups: ["subjective", "building", "house", "neutral"], genitive: "Cabin's", plural: "Cabins" },
	{ word: "Lodge", rarity: 2, groups: ["subjective", "building", "house", "neutral"], genitive: "Lodge's", plural: "Lodges" },
	{ word: "Manor", rarity: 2, groups: ["subjective", "building", "house", "positive"], genitive: "Manor's", plural: "Manors" },
	{ word: "Mansion", rarity: 2, groups: ["subjective", "building", "house", "positive"], genitive: "Mansion's", plural: "Mansions" },
	{ word: "Palace", rarity: 2, groups: ["subjective", "building", "house", "positive"], genitive: "Palace's", plural: "Palaces" },
	{ word: "Castle", rarity: 2, groups: ["subjective", "building", "castle"], genitive: "Castle's", plural: "Castles" },
	{ word: "Keep", rarity: 2, groups: ["subjective", "building", "castle"], genitive: "Keep's", plural: "Keeps" },
	{ word: "Fort", rarity: 2, groups: ["subjective", "building", "castle"], genitive: "Fort's", plural: "Forts" },
	{ word: "Tower", rarity: 2, groups: ["subjective", "building", "castle"], genitive: "Tower's", plural: "Towers" },
	{ word: "Temple", rarity: 2, groups: ["subjective", "building", "castle"], genitive: "Temple's", plural: "Temples" },
	{ word: "Church", rarity: 2, groups: ["subjective", "building", "church", "religious"], genitive: "Church's", plural: "Churches" },
	{ word: "Cathedral", rarity: 2, groups: ["subjective", "building", "church", "religious"], genitive: "Cathedral's", plural: "Cathedrals" },
	{ word: "Monastery", rarity: 2, groups: ["subjective", "building", "monastery", "religious"], genitive: "Monastery's", plural: "Monasteries" },
	{ word: "Abbey", rarity: 2, groups: ["subjective", "building", "monastery", "religious"], genitive: "Abbey's", plural: "Abbeys" },
	{ word: "Shrine", rarity: 2, groups: ["subjective", "building", "church", "religious"], genitive: "Shrine's", plural: "Shrines" },
	{ word: "Sanctuary", rarity: 2, groups: ["subjective", "building", "monastery", "religious"], genitive: "Sanctuary's", plural: "Sanctuaries" },
	{ word: "Chapel", rarity: 2, groups: ["subjective", "building", "church", "religious"], genitive: "Chapel's", plural: "Chapels" },
	{ word: "Graveyard", rarity: 2, groups: ["subjective", "building", "location", "religious", "death"], genitive: "Graveyard's", plural: "Graveyards" },
	{ word: "Cemetery", rarity: 2, groups: ["subjective", "building", "location", "religious", "death"], genitive: "Cemetery's", plural: "Cemeteries" },
	{ word: "Tomb", rarity: 2, groups: ["subjective", "building", "religious", "death"], genitive: "Tomb's", plural: "Tombs" },
	{ word: "Crypt", rarity: 2, groups: ["subjective", "building", "religious", "death"], genitive: "Crypt's", plural: "Crypts" },
	{ word: "Catacomb", rarity: 2, groups: ["subjective", "building", "location", "religious", "death"], genitive: "Catacomb's", plural: "Catacombs" },
	{ word: "Mausoleum", rarity: 2, groups: ["subjective", "building", "religious", "death"], genitive: "Mausoleum's", plural: "Mausoleums" },
	{ word: "Tavern", rarity: 2, groups: ["subjective", "building", "tavern"], genitive: "Tavern's", plural: "Taverns" },
	{ word: "Inn", rarity: 2, groups: ["subjective", "building", "tavern"], genitive: "Inn's", plural: "Inns" },
	{ word: "Pub", rarity: 2, groups: ["subjective", "building", "tavern"], genitive: "Pub's", plural: "Pubs" },
	{ word: "Bar", rarity: 2, groups: ["subjective", "building", "tavern"], genitive: "Bar's", plural: "Bars" },
	{ word: "Saloon", rarity: 2, groups: ["subjective", "building", "tavern", "western"], genitive: "Saloon's", plural: "Saloons" },
	{ word: "Taphouse", rarity: 2, groups: ["subjective", "building", "tavern"], genitive: "Taphouse's", plural: "Taphouses" },
	{ word: "Brewery", rarity: 2, groups: ["subjective", "building", "alhocol", "craftsman"], genitive: "Brewery's", plural: "Breweries" },
	{ word: "Distillery", rarity: 2, groups: ["subjective", "building", "alhocol", "craftsman"], genitive: "Distillery's", plural: "Distilleries" },
	{ word: "Winery", rarity: 2, groups: ["subjective", "building", "alhocol", "craftsman"], genitive: "Winery's", plural: "Wineries" },
	{ word: "Bakery", rarity: 2, groups: ["subjective", "building", "food", "craftsman"], genitive: "Bakery's", plural: "Bakeries" },
	{ word: "Butcher", rarity: 2, groups: ["subjective", "building", "food", "animal", "craftsman"], genitive: "Butcher's", plural: "Butchers" },
	{ word: "Carpenter", rarity: 2, groups: ["subjective", "building", "craftsman", "wood"], genitive: "Carpenter's", plural: "Carpenters" },
	{ word: "Mason", rarity: 2, groups: ["subjective", "building", "craftsman", "stone"], genitive: "Mason's", plural: "Masons" },
	{ word: "Blacksmith", rarity: 2, groups: ["subjective", "building", "craftsman", "forge"], genitive: "Blacksmith's", plural: "Blacksmiths" },
	{ word: "Smithy", rarity: 2, groups: ["subjective", "building", "craftsman", "forge"], genitive: "Smithy's", plural: "Smithies" },
	{ word: "Forge", rarity: 2, groups: ["subjective", "building", "craftsman", "forge"], genitive: "Forge's", plural: "Forges" },
	{ word: "Foundry", rarity: 2, groups: ["subjective", "building", "craftsman", "forge"], genitive: "Foundry's", plural: "Foundries" },
	{ word: "Stable", rarity: 2, groups: ["subjective", "building", "husbandry", "horse", "farm"], genitive: "Stable's", plural: "Stables" },
	{ word: "Barn", rarity: 2, groups: ["subjective", "building", "husbandry", "cow", "farm"], genitive: "Barn's", plural: "Barns" },
	{ word: "Mill", rarity: 2, groups: ["subjective", "building", "craftsman", "food", "farm", "mill"], genitive: "Mill's", plural: "Mills" },
	{ word: "Windmill", rarity: 2, groups: ["subjective", "building", "craftsman", "food", "farm", "mill"], genitive: "Windmill's", plural: "Windmills" },
	{ word: "Lumbermill", rarity: 2, groups: ["subjective", "building", "craftsman", "wood"], genitive: "Lumbermill's", plural: "Lumbermills" },
	{ word: "Sawmill", rarity: 2, groups: ["subjective", "building", "craftsman", "wood"], genitive: "Sawmill's", plural: "Sawmills" },
	{ word: "Cottonmill", rarity: 2, groups: ["subjective", "building", "craftsman", "clothes", "mill"], genitive: "Cottonmill's", plural: "Cottonmills" },
	{ word: "Dairy", rarity: 2, groups: ["subjective", "building", "craftsman", "clothes", "mill"], genitive: "Dairy's", plural: "Dairies" },
	{ word: "Dairyfarm", rarity: 2, groups: ["subjective", "building", "craftsman", "farm", "cow", "animal"], genitive: "Dairyfarm's", plural: "Dairyfarms" },
	{ word: "Farm", rarity: 2, groups: ["subjective", "building", "craftsman", "farm"], genitive: "Farm's", plural: "Farms" },
	{ word: "Ranch", rarity: 2, groups: ["subjective", "building", "craftsman", "farm"], genitive: "Ranch's", plural: "Ranches" },
	{ word: "Orchard", rarity: 2, groups: ["subjective", "building", "craftsman", "farm"], genitive: "Orchard's", plural: "Orchards" },
	{ word: "Vineyard", rarity: 2, groups: ["subjective", "building", "craftsman", "farm", "alcohol"], genitive: "Vineyard's", plural: "Vineyards" },

	// Order of adjectives (opinion-size-quality-shape-age-colour-origin-material-type-purpose)
	// Adjectives describing places
	{ word: "Sturdy", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "sturdier", superlative: "sturdiest" },
	{ word: "Rugged", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "ruggeder", superlative: "ruggedest" },
	{ word: "Rustic", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "rusticer", superlative: "rusticest" },
	{ word: "Robust", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "robuster", superlative: "robustest" },
	{ word: "Cozy", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "cozier", superlative: "coziest" },
	{ word: "Quaint", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "quainter", superlative: "quaintest" },
	{ word: "Charming", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "charminger", superlative: "charmingest" },
	{ word: "Picturesque", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "picturesquer", superlative: "picturesquest" },
	{ word: "Idyllic", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "idyllicer", superlative: "idyllicest" },
	{ word: "Serene", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "serener", superlative: "serenest" },
	{ word: "Tranquil", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "tranquiler", superlative: "tranquilest" },
	{ word: "Peaceful", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "peacefuler", superlative: "peacefulest" },
	{ word: "Quiet", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "quieter", superlative: "quietest" },
	{ word: "Secluded", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "secludeder", superlative: "secludedest" },
	{ word: "Remote", rarity: 2, groups: ["adjective", "place", "positive", "quality"], comparative: "remoter", superlative: "remotest" },
	{ word: "Isolated", rarity: 2, groups: ["adjective", "place", "negative", "quality"], comparative: "isolateder", superlative: "isolatedest" },
	{ word: "Desolate", rarity: 2, groups: ["adjective", "place", "negative", "quality"], comparative: "desolater", superlative: "desolatest" },
	{ word: "Barren", rarity: 2, groups: ["adjective", "place", "negative", "quality"], comparative: "barrener", superlative: "barrenest" },
	{ word: "Bleak", rarity: 2, groups: ["adjective", "place", "negative", "quality"], comparative: "bleaker", superlative: "bleakest" },
	{ word: "Grim", rarity: 2, groups: ["adjective", "place", "negative", "quality"], comparative: "grimer", superlative: "grimiest" },
	{ word: "Gloomy", rarity: 2, groups: ["adjective", "place", "negative", "quality"], comparative: "gloomier", superlative: "gloomiest" },
	{ word: "Dreary", rarity: 2, groups: ["adjective", "place", "negative", "quality"], comparative: "drearier", superlative: "dreariest" },

	{ word: "Old", rarity: 2, groups: ["adjective", "place", "person", "item", "positive", "age"], comparative: "older", superlative: "oldest" },
	{ word: "Ancient", rarity: 2, groups: ["adjective", "place", "person", "item", "positive", "age"], comparative: "ancienter", superlative: "ancientest" },
	{ word: "Antique", rarity: 2, groups: ["adjective", "place", "item", "positive", "age"], comparative: "antiquer", superlative: "antiquest" },
	{ word: "Historic", rarity: 2, groups: ["adjective", "place", "positive", "age"], comparative: "historicer", superlative: "historicest" },
	{ word: "Timeless", rarity: 2, groups: ["adjective", "place", "person", "positive", "age"], comparative: "timelesser", superlative: "timelessest" },
	{ word: "Classic", rarity: 2, groups: ["adjective", "place", "item", "positive", "age"], comparative: "classicer", superlative: "classiest" },
	{ word: "Vintage", rarity: 2, groups: ["adjective", "place", "item", "positive", "age"], comparative: "vintager", superlative: "vintagest" },

	{ word: "New", rarity: 2, groups: ["adjective", "place", "item", "positive", "age"], comparative: "newer", superlative: "newest" },
	{ word: "Newfangled", rarity: 2, groups: ["adjective", "place", "positive", "age"], comparative: "newfangleder", superlative: "newfangledest" },
	{ word: "Novel", rarity: 2, groups: ["adjective", "place", "positive", "age"], comparative: "noveler", superlative: "novelest" },
	{ word: "Fresh", rarity: 2, groups: ["adjective", "person", "positive", "age"], comparative: "fresher", superlative: "freshest" },
	{ word: "Young", rarity: 2, groups: ["adjective", "place", "person", "positive", "age"], comparative: "younger", superlative: "youngest" },

	{
		word: "Hard",
		rarity: 2,
		groups: ["adjective", "person", "place", "item", "quality"],
		comparative: "harder",
		superlative: "hardest",
	},
	{ word: "Durable", rarity: 2, groups: ["adjective", "item", "positive", "quality"], comparative: "durabler", superlative: "durablest" },

	{
		word: "Soft",
		rarity: 2,
		groups: ["adjective", "person", "place", "item", "quality"],
		comparative: "softer",
		superlative: "softest",
	},
	{ word: "Delicate", rarity: 2, groups: ["adjective", "person", "item", "negative", "quality"], comparative: "delicater", superlative: "delicatest" },
	{ word: "Fragile", rarity: 2, groups: ["adjective", "person", "place", "item", "negative", "quality"], comparative: "fragiler", superlative: "fragilest" },
	{ word: "Weak", rarity: 2, groups: ["adjective", "person", "item", "negative", "quality"], comparative: "weaker", superlative: "weakest" },
	{ word: "Brittle", rarity: 2, groups: ["adjective", "item", "negative", "quality"], comparative: "brittler", superlative: "brittlest" },
	{ word: "Frail", rarity: 2, groups: ["adjective", "person", "item", "negative", "quality"], comparative: "frailer", superlative: "frailest" },
	{ word: "Flimsy", rarity: 2, groups: ["adjective", "person", "negative", "quality"], comparative: "flimsier", superlative: "flimsiest" },
	{ word: "Tender", rarity: 2, groups: ["adjective", "person", "positive", "negative", "quality"], comparative: "tenderer", superlative: "tenderest" },

	{ word: "Sharp", rarity: 2, groups: ["adjective", "person", "item", "positive", "quality"], comparative: "sharper", superlative: "sharpest" },
	{ word: "Keen", rarity: 2, groups: ["adjective", "person", "item", "positive", "quality"], comparative: "keener", superlative: "keenest" },

	{ word: "Dull", rarity: 2, groups: ["adjective", "person", "item", "negative", "quality"], comparative: "duller", superlative: "dullest" },
	{ word: "Blunt", rarity: 2, groups: ["adjective", "person", "item", "negative", "quality"], comparative: "blunter", superlative: "bluntest" },

	{ word: "Proven", rarity: 3, groups: ["adjective", "person", "place", "positive", "quality"], comparative: "more proven", superlative: "most proven" },
	{ word: "Tried", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more tried", superlative: "most tried" },
	{
		word: "True",
		rarity: 3,
		groups: ["adjective", "person", "place", "location", "item", "positive", "quality"],
		comparative: "truer",
		superlative: "truest",
	},
	{ word: "Customized", rarity: 3, groups: ["adjective", "item", "positive", "quality"], comparative: "more customized", superlative: "most customized" },
	{ word: "Loyal", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "loyaler", superlative: "loyalest" },
	{ word: "Faithful", rarity: 3, groups: ["adjective", "person", "item", "positive", "quality"], comparative: "more faithful", superlative: "most faithful" },
	{ word: "Devoted", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more devoted", superlative: "most devoted" },
	{
		word: "Dedicated",
		rarity: 3,
		groups: ["adjective", "person", "item", "positive", "quality"],
		comparative: "more dedicated",
		superlative: "most dedicated",
	},
	{ word: "Committed", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more committed", superlative: "most committed" },
	{ word: "Steadfast", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more steadfast", superlative: "most steadfast" },
	{ word: "Staunch", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more staunch", superlative: "most staunch" },
	{ word: "Unwavering", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more unwavering", superlative: "most unwavering" },
	{
		word: "Unflinching",
		rarity: 3,
		groups: ["adjective", "person", "positive", "quality"],
		comparative: "more unflinching",
		superlative: "most unflinching",
	},
	{ word: "Unswerving", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more unswerving", superlative: "most unswerving" },
	{ word: "Unyielding", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more unyielding", superlative: "most unyielding" },
	{ word: "Unshakable", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more unshakable", superlative: "most unshakable" },

	{ word: "Unproven", rarity: 3, groups: ["adjective", "person", "item", "negative", "quality"], comparative: "more unproven", superlative: "most unproven" },
	{ word: "Disloyal", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more disloyal", superlative: "most disloyal" },
	{ word: "Unfaithful", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more unfaithful", superlative: "most unfaithful" },
	{
		word: "Uncommitted",
		rarity: 3,
		groups: ["adjective", "person", "negative", "quality"],
		comparative: "more uncommitted",
		superlative: "most uncommitted",
	},
	{ word: "Unsteady", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more unsteady", superlative: "most unsteady" },
	{ word: "Unstaunch", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more unstaunch", superlative: "most unstaunch" },

	{
		word: "Practical",
		rarity: 3,
		groups: ["adjective", "person", "place", "positive", "quality"],
		comparative: "more practical",
		superlative: "most practical",
	},
	{
		word: "Pragmatic",
		rarity: 3,
		groups: ["adjective", "person", "place", "positive", "quality"],
		comparative: "more pragmatic",
		superlative: "most pragmatic",
	},
	{ word: "Realistic", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more realistic", superlative: "most realistic" },
	{ word: "Sensible", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more sensible", superlative: "most sensible" },
	{
		word: "Rational",
		rarity: 3,
		groups: ["adjective", "person", "place", "positive", "quality"],
		comparative: "more rational",
		superlative: "most rational",
	},
	{
		word: "Reasonable",
		rarity: 3,
		groups: ["adjective", "person", "place", "positive", "quality"],
		comparative: "more reasonable",
		superlative: "most reasonable",
	},
	{ word: "Logical", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more logical", superlative: "most logical" },
	{ word: "Sane", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "saner", superlative: "sanest" },
	{ word: "Sound", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "sounder", superlative: "soundest" },
	{ word: "Sagacious", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more sagacious", superlative: "most sagacious" },
	{ word: "Sapient", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more sapient", superlative: "most sapient" },
	{ word: "Savvy", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "savvier", superlative: "savviest" },
	{ word: "Clever", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "cleverer", superlative: "cleverest" },
	{ word: "Smart", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "smarter", superlative: "smartest" },

	{
		word: "Intelligent",
		rarity: 3,
		groups: ["adjective", "person", "positive", "quality"],
		comparative: "more intelligent",
		superlative: "most intelligent",
	},
	{ word: "Bright", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "brighter", superlative: "brightest" },
	{ word: "Brilliant", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more brilliant", superlative: "most brilliant" },
	{ word: "Genius", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more genius", superlative: "most genius" },
	{ word: "Gifted", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more gifted", superlative: "most gifted" },
	{ word: "Talented", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more talented", superlative: "most talented" },
	{ word: "Adept", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more adept", superlative: "most adept" },
	{ word: "Skilled", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more skilled", superlative: "most skilled" },
	{ word: "Proficient", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more proficient", superlative: "most proficient" },
	{ word: "Competent", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more competent", superlative: "most competent" },
	{ word: "Capable", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more capable", superlative: "most capable" },
	{ word: "Able", rarity: 3, groups: ["adjective", "person", "positive", "quality"], comparative: "more able", superlative: "most able" },

	{ word: "Happy", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "happier", superlative: "happiest" },
	{ word: "Cheerful", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "more cheerful", superlative: "most cheerful" },
	{ word: "Joyful", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "more joyful", superlative: "most joyful" },
	{ word: "Merry", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "merrier", superlative: "merriest" },
	{ word: "Jolly", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "jollier", superlative: "jolliest" },
	{ word: "Jovial", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "more jovial", superlative: "most jovial" },
	{ word: "Glad", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "gladder", superlative: "gladdest" },
	{ word: "Pleased", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "more pleased", superlative: "most pleased" },
	{
		word: "Delighted",
		rarity: 1,
		groups: ["adjective", "person", "positive", "quality", "mood"],
		comparative: "more delighted",
		superlative: "most delighted",
	},
	{ word: "Content", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "more content", superlative: "most content" },
	{
		word: "Satisfied",
		rarity: 1,
		groups: ["adjective", "person", "positive", "quality", "mood"],
		comparative: "more satisfied",
		superlative: "most satisfied",
	},
	{ word: "Gleeful", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "more gleeful", superlative: "most gleeful" },
	{ word: "Elated", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "more elated", superlative: "most elated" },
	{ word: "Ecstatic", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "more ecstatic", superlative: "most ecstatic" },
	{ word: "Euphoric", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "more euphoric", superlative: "most euphoric" },
	{ word: "Blissful", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "more blissful", superlative: "most blissful" },
	{ word: "Exultant", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "more exultant", superlative: "most exultant" },
	{
		word: "Overjoyed",
		rarity: 1,
		groups: ["adjective", "person", "positive", "quality", "mood"],
		comparative: "more overjoyed",
		superlative: "most overjoyed",
	},
	{ word: "Thrilled", rarity: 1, groups: ["adjective", "person", "positive", "quality", "mood"], comparative: "more thrilled", superlative: "most thrilled" },

	{ word: "Sad", rarity: 1, groups: ["adjective", "person", "negative", "quality", "mood"], comparative: "sadder", superlative: "saddest" },
	{ word: "Unhappy", rarity: 1, groups: ["adjective", "person", "negative", "quality", "mood"], comparative: "more unhappy", superlative: "most unhappy" },
	{
		word: "Depressed",
		rarity: 1,
		groups: ["adjective", "person", "negative", "quality", "mood"],
		comparative: "more depressed",
		superlative: "most depressed",
	},
	{ word: "Downcast", rarity: 1, groups: ["adjective", "person", "negative", "quality", "mood"], comparative: "more downcast", superlative: "most downcast" },
	{
		word: "Downhearted",
		rarity: 1,
		groups: ["adjective", "person", "negative", "quality", "mood"],
		comparative: "more downhearted",
		superlative: "most downhearted",
	},
	{ word: "Dejected", rarity: 1, groups: ["adjective", "person", "negative", "quality", "mood"], comparative: "more dejected", superlative: "most dejected" },
	{
		word: "Dispirited",
		rarity: 1,
		groups: ["adjective", "person", "negative", "quality", "mood"],
		comparative: "more dispirited",
		superlative: "most dispirited",
	},
	{
		word: "Disheartened",
		rarity: 1,
		groups: ["adjective", "person", "negative", "quality", "mood"],
		comparative: "more disheartened",
		superlative: "most disheartened",
	},
	{
		word: "Discouraged",
		rarity: 1,
		groups: ["adjective", "person", "negative", "quality", "mood"],
		comparative: "more discouraged",
		superlative: "most discouraged",
	},
	{ word: "Dismayed", rarity: 1, groups: ["adjective", "person", "negative", "quality", "mood"], comparative: "more dismayed", superlative: "most dismayed" },
	{
		word: "Disappointed",
		rarity: 1,
		groups: ["adjective", "person", "negative", "quality", "mood"],
		comparative: "more disappointed",
		superlative: "most disappointed",
	},
	{
		word: "Disillusioned",
		rarity: 1,
		groups: ["adjective", "person", "negative", "quality", "mood"],
		comparative: "more disillusioned",
		superlative: "most disillusioned",
	},

	{ word: "Impulsive", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more impulsive", superlative: "most impulsive" },
	{ word: "Rash", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "rasher", superlative: "rashest" },
	{ word: "Hasty", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "hastier", superlative: "hastiest" },
	{
		word: "Precipitate",
		rarity: 3,
		groups: ["adjective", "person", "negative", "quality"],
		comparative: "more precipitate",
		superlative: "most precipitate",
	},
	{ word: "Headlong", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more headlong", superlative: "most headlong" },
	{ word: "Foolhardy", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more foolhardy", superlative: "most foolhardy" },
	{ word: "Reckless", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more reckless", superlative: "most reckless" },
	{ word: "Careless", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more careless", superlative: "most careless" },
	{ word: "Negligent", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more negligent", superlative: "most negligent" },
	{ word: "Slipshod", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more slipshod", superlative: "most slipshod" },
	{ word: "Sloppy", rarity: 3, groups: ["adjective", "person", "place", "negative", "quality"], comparative: "sloppier", superlative: "sloppiest" },
	{ word: "Slapdash", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more slapdash", superlative: "most slapdash" },
	{ word: "Lax", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "laxer", superlative: "laxest" },
	{ word: "Lenient", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more lenient", superlative: "most lenient" },
	{ word: "Indulgent", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more indulgent", superlative: "most indulgent" },
	{ word: "Permissive", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more permissive", superlative: "most permissive" },

	{ word: "Unreliable", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more unreliable", superlative: "most unreliable" },
	{
		word: "Untrustworthy",
		rarity: 3,
		groups: ["adjective", "person", "negative", "quality"],
		comparative: "more untrustworthy",
		superlative: "most untrustworthy",
	},
	{
		word: "Unscrupulous",
		rarity: 3,
		groups: ["adjective", "person", "negative", "quality"],
		comparative: "more unscrupulous",
		superlative: "most unscrupulous",
	},
	{ word: "Dishonest", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more dishonest", superlative: "most dishonest" },
	{ word: "Deceitful", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more deceitful", superlative: "most deceitful" },
	{ word: "Deceptive", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more deceptive", superlative: "most deceptive" },
	{
		word: "Duplicitous",
		rarity: 3,
		groups: ["adjective", "person", "negative", "quality"],
		comparative: "more duplicitous",
		superlative: "most duplicitous",
	},
	{ word: "Two-faced", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more two-faced", superlative: "most two-faced" },
	{
		word: "Double-dealing",
		rarity: 3,
		groups: ["adjective", "person", "negative", "quality"],
		comparative: "more double-dealing",
		superlative: "most double-dealing",
	},
	{
		word: "Unprincipled",
		rarity: 3,
		groups: ["adjective", "person", "negative", "quality"],
		comparative: "more unprincipled",
		superlative: "most unprincipled",
	},
	{ word: "Unethical", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more unethical", superlative: "most unethical" },
	{ word: "Immoral", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more immoral", superlative: "most immoral" },
	{ word: "Corrupt", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more corrupt", superlative: "most corrupt" },
	{ word: "Venal", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more venal", superlative: "most venal" },
	{ word: "Bribeable", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more bribeable", superlative: "most bribeable" },
	{
		word: "Unconscionable",
		rarity: 3,
		groups: ["adjective", "person", "negative", "quality"],
		comparative: "more unconscionable",
		superlative: "most unconscionable",
	},
	{
		word: "Unscrupulous",
		rarity: 3,
		groups: ["adjective", "person", "negative", "quality"],
		comparative: "more unscrupulous",
		superlative: "most unscrupulous",
	},
	{
		word: "Unprincipled",
		rarity: 3,
		groups: ["adjective", "person", "negative", "quality"],
		comparative: "more unprincipled",
		superlative: "most unprincipled",
	},
	{ word: "Unethical", rarity: 3, groups: ["adjective", "person", "negative", "quality"], comparative: "more unethical", superlative: "most unethical" },

	// Temperature
	{ word: "Hot", rarity: 1, groups: ["adjective", "subject", "place", "temperature", "quality"], comparative: "hotter", superlative: "hottest" },
	{ word: "Warm", rarity: 1, groups: ["adjective", "subject", "place", "temperature", "quality"], comparative: "warmer", superlative: "warmest" },
	{ word: "Cold", rarity: 1, groups: ["adjective", "subject", "place", "temperature", "quality"], comparative: "colder", superlative: "coldest" },
	{ word: "Cool", rarity: 1, groups: ["adjective", "subject", "place", "temperature", "quality"], comparative: "cooler", superlative: "coolest" },

	// Size
	{ word: "Big", rarity: 1, groups: ["adjective", "subject", "place", "item", "size", "quality"], comparative: "bigger", superlative: "biggest" },
	{ word: "Large", rarity: 1, groups: ["adjective", "subject", "place", "item", "size", "quality"], comparative: "larger", superlative: "largest" },
	{ word: "Small", rarity: 1, groups: ["adjective", "subject", "place", "item", "size", "quality"], comparative: "smaller", superlative: "smallest" },
	{ word: "Little", rarity: 1, groups: ["adjective", "subject", "place", "item", "size", "quality"], comparative: "less", superlative: "least" },

	// Colors
	{
		word: "Red",
		rarity: 1,
		groups: ["adjective", "subject", "item", "person", "place", "location", "color"],
		genitive: "red's",
		plural: "reds",
		comparative: "redder",
		superlative: "reddest",
	},
	{
		word: "Orange",
		rarity: 1,
		groups: ["adjective", "subject", "item", "person", "place", "location", "color"],
		genitive: "orange's",
		plural: "oranges",
		comparative: "oranger",
		superlative: "orangest",
	},
	{
		word: "Yellow",
		rarity: 1,
		groups: ["adjective", "subject", "item", "person", "place", "location", "color"],
		genitive: "yellow's",
		plural: "yellows",
		comparative: "yellower",
		superlative: "yellowest",
	},
	{
		word: "Green",
		rarity: 1,
		groups: ["adjective", "subject", "item", "person", "place", "location", "color"],
		genitive: "green's",
		plural: "greens",
		comparative: "greener",
		superlative: "greenest",
	},
	{
		word: "Blue",
		rarity: 1,
		groups: ["adjective", "subject", "item", "person", "place", "location", "color"],
		genitive: "blue's",
		plural: "blues",
		comparative: "bluer",
		superlative: "bluest",
	},
	{
		word: "Purple",
		rarity: 1,
		groups: ["adjective", "subject", "item", "person", "place", "location", "color"],
		genitive: "purple's",
		plural: "purples",
		comparative: "purpler",
		superlative: "purplest",
	},
	{
		word: "Pink",
		rarity: 1,
		groups: ["adjective", "subject", "item", "person", "place", "location", "color"],
		genitive: "pink's",
		plural: "pinks",
		comparative: "pinker",
		superlative: "pinkest",
	},
	{
		word: "Brown",
		rarity: 1,
		groups: ["adjective", "subject", "item", "person", "place", "location", "color"],
		genitive: "brown's",
		plural: "browns",
		comparative: "browner",
		superlative: "brownest",
	},
	{
		word: "White",
		rarity: 1,
		groups: ["adjective", "subject", "item", "person", "place", "location", "color"],
		genitive: "white's",
		plural: "whites",
		comparative: "whiter",
		superlative: "whitest",
	},
	{
		word: "Black",
		rarity: 1,
		groups: ["adjective", "subject", "item", "person", "place", "location", "color"],
		genitive: "black's",
		plural: "blacks",
		comparative: "blacker",
		superlative: "blackest",
	},

	{ word: "Legendary", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"] },
	{ word: "Epic", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"] },
	{ word: "Mythic", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"] },
	{ word: "Illustrious", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"] },
	{ word: "Fabled", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"] },
	{ word: "Iconic", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"] },
	{ word: "Heroic", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"] },
	{ word: "Finest", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"] },
	{ word: "Renowned", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"] },

	{ word: "Fine", rarity: 3, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "finer", superlative: "finest" },
	{ word: "Great", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "greater", superlative: "greatest" },
	{ word: "Grand", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "grander", superlative: "grandest" },
	{ word: "Magnificent", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more magnificent", superlative: "most magnificent" },
	{ word: "Marvelous", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more marvelous", superlative: "most marvelous" },
	{ word: "Splendid", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more splendid", superlative: "most splendid" },
	{ word: "Superb", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more superb", superlative: "most superb" },
	{ word: "Wonderful", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more wonderful", superlative: "most wonderful" },
	{ word: "Amazing", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more amazing", superlative: "most amazing" },
	{ word: "Astounding", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more astounding", superlative: "most astounding" },
	{ word: "Awesome", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more awesome", superlative: "most awesome" },
	{ word: "Breathtaking", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more breathtaking", superlative: "most breathtaking" },
	{ word: "Impressive", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more impressive", superlative: "most impressive" },
	{ word: "Majestic", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more majestic", superlative: "most majestic" },
	{ word: "Mighty", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "mightier", superlative: "mightiest" },
	{ word: "Noble", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "nobler", superlative: "noblest" },
	{ word: "Spectacular", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more spectacular", superlative: "most spectacular" },
	{ word: "Stunning", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more stunning", superlative: "most stunning" },
	{ word: "Sublime", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more sublime", superlative: "most sublime" },
	{ word: "Supreme", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "supremer", superlative: "supremest" },
	{ word: "Terrific", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more terrific", superlative: "most terrific" },
	{ word: "Wondrous", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more wondrous", superlative: "most wondrous" },
	{ word: "Exalted", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more exalted", superlative: "most exalted" },
	{ word: "Glorious", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more glorious", superlative: "most glorious" },
	{ word: "Radiant", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more radiant", superlative: "most radiant" },
	{ word: "Resplendent", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more resplendent", superlative: "most resplendent" },
	{ word: "Stupendous", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "stupendouser", superlative: "stupendousest" },
	{ word: "Transcendent", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "transcendenter", superlative: "transcendentest" },
	{ word: "Unbelievable", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "unbelievabler", superlative: "unbelievablest" },
	{ word: "Unreal", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "unrealer", superlative: "unrealest" },
	{ word: "Wonderful", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more wonderful", superlative: "most wonderful" },
	{ word: "Astonishing", rarity: 4, groups: ["adjective", "item", "people", "place", "positive", "epic"], comparative: "more astonishing", superlative: "most astonishing" },






	// Objects in medieval time
	{ word: "Book", rarity: 1, groups: ["object", "item"], genitive: "book's", plural: "books" },
	{ word: "Scroll", rarity: 1, groups: ["object", "item"], genitive: "scroll's", plural: "scrolls" },
	{ word: "Parchment", rarity: 1, groups: ["object", "item"], genitive: "parchment's", plural: "parchments" },
	{ word: "Quill", rarity: 1, groups: ["object", "item", "tool", "alchemy"], genitive: "quill's", plural: "quills" },
	{ word: "Ink", rarity: 1, groups: ["object", "item", "tool", "alchemy"], genitive: "ink's", plural: "inks" },
	{ word: "Candle", rarity: 1, groups: ["object", "item", "adventure"], genitive: "candle's", plural: "candles" },
	{ word: "Lantern", rarity: 1, groups: ["object", "item", "adventure"], genitive: "lantern's", plural: "lanterns" },
	{ word: "Torch", rarity: 1, groups: ["object", "item", "adventure"], genitive: "torch's", plural: "torches" },
	{ word: "Candlestick", rarity: 1, groups: ["object", "item"], genitive: "candlestick's", plural: "candlesticks" },
	{ word: "Rope", rarity: 1, groups: ["object", "item"], genitive: "rope's", plural: "ropes" },
	{ word: "Chain", rarity: 1, groups: ["object", "item"], genitive: "chain's", plural: "chains" },
	{ word: "Key", rarity: 1, groups: ["object", "item"], genitive: "key's", plural: "keys" },
	{ word: "Lock", rarity: 1, groups: ["object", "item"], genitive: "lock's", plural: "locks" },
	{ word: "Chest", rarity: 1, groups: ["object", "item"], genitive: "chest's", plural: "chests" },
	{ word: "Box", rarity: 1, groups: ["object", "item"], genitive: "box's", plural: "boxes" },
	{ word: "Bag", rarity: 1, groups: ["object", "item"], genitive: "bag's", plural: "bags" },
	{ word: "Sack", rarity: 1, groups: ["object", "item"], genitive: "sack's", plural: "sacks" },
	{ word: "Pouch", rarity: 1, groups: ["object", "item"], genitive: "pouch's", plural: "pouches" },
	{ word: "Purse", rarity: 1, groups: ["object", "item"], genitive: "purse's", plural: "purses" },
	{ word: "Coin", rarity: 1, groups: ["object", "item"], genitive: "coin's", plural: "coins" },

	// Jewelry
	{ word: "Ring", rarity: 1, groups: ["object", "item", "jewelry"], genitive: "ring's", plural: "rings" },
	{ word: "Necklace", rarity: 1, groups: ["object", "item", "jewelry"], genitive: "necklace's", plural: "necklaces" },
	{ word: "Bracelet", rarity: 1, groups: ["object", "item", "jewelry"], genitive: "bracelet's", plural: "bracelets" },
	{ word: "Earring", rarity: 1, groups: ["object", "item", "jewelry"], genitive: "earring's", plural: "earrings" },
	{ word: "Brooch", rarity: 1, groups: ["object", "item", "jewelry"], genitive: "brooch's", plural: "brooches" },
	{ word: "Amulet", rarity: 1, groups: ["object", "item", "jewelry"], genitive: "amulet's", plural: "amulets" },
	{ word: "Talisman", rarity: 1, groups: ["object", "item", "jewelry"], genitive: "talisman's", plural: "talismans" },
	{ word: "Pendant", rarity: 1, groups: ["object", "item", "jewelry"], genitive: "pendant's", plural: "pendants" },
	{ word: "Crown", rarity: 1, groups: ["object", "item", "jewelry"], genitive: "crown's", plural: "crowns" },
	{ word: "Tiara", rarity: 1, groups: ["object", "item", "jewelry"], genitive: "tiara's", plural: "tiaras" },

	// Clothes
	{ word: "Hat", rarity: 1, groups: ["object", "item", "clothes"], genitive: "hat's", plural: "hats" },
	{ word: "Cap", rarity: 1, groups: ["object", "item", "clothes"], genitive: "cap's", plural: "caps" },
	{ word: "Cape", rarity: 1, groups: ["object", "item", "clothes"], genitive: "cape's", plural: "capes" },
	{ word: "Cloak", rarity: 1, groups: ["object", "item", "clothes"], genitive: "cloak's", plural: "cloaks" },
	{ word: "Robe", rarity: 1, groups: ["object", "item", "clothes"], genitive: "robe's", plural: "robes" },
	{ word: "Gown", rarity: 1, groups: ["object", "item", "clothes"], genitive: "gown's", plural: "gowns" },
	{ word: "Dress", rarity: 1, groups: ["object", "item", "clothes"], genitive: "dress's", plural: "dresses" },
	{ word: "Shirt", rarity: 1, groups: ["object", "item", "clothes"], genitive: "shirt's", plural: "shirts" },
	{ word: "Tunic", rarity: 1, groups: ["object", "item", "clothes"], genitive: "tunic's", plural: "tunics" },
	{ word: "Vest", rarity: 1, groups: ["object", "item", "clothes"], genitive: "vest's", plural: "vests" },
	{ word: "Jerkin", rarity: 1, groups: ["object", "item", "clothes"], genitive: "jerkin's", plural: "jerkins" },
	{ word: "Jacket", rarity: 1, groups: ["object", "item", "clothes"], genitive: "jacket's", plural: "jackets" },
	{ word: "Coat", rarity: 1, groups: ["object", "item", "clothes"], genitive: "coat's", plural: "coats" },
	{ word: "Clothes", rarity: 1, groups: ["object", "item", "clothes"], genitive: "clothes'", plural: "clothes" },
	{ word: "Pants", rarity: 1, groups: ["object", "item", "clothes"], genitive: "pants'", plural: "pants" },
	{ word: "Shorts", rarity: 1, groups: ["object", "item", "clothes"], genitive: "shorts'", plural: "shorts" },
	{ word: "Skirt", rarity: 1, groups: ["object", "item", "clothes"], genitive: "skirt's", plural: "skirts" },
	{ word: "Dress", rarity: 1, groups: ["object", "item", "clothes"], genitive: "dress's", plural: "dresses" },
	{ word: "Gloves", rarity: 1, groups: ["object", "item", "clothes"], genitive: "gloves'", plural: "gloves" },
	{ word: "Gauntlets", rarity: 1, groups: ["object", "item", "clothes"], genitive: "gauntlets'", plural: "gauntlets" },
	{ word: "Bracers", rarity: 1, groups: ["object", "item", "clothes"], genitive: "bracers'", plural: "bracers" },
	{ word: "Boots", rarity: 1, groups: ["object", "item", "clothes"], genitive: "boots'", plural: "boots" },
	{ word: "Shoes", rarity: 1, groups: ["object", "item", "clothes"], genitive: "shoes'", plural: "shoes" },
	{ word: "Sandals", rarity: 1, groups: ["object", "item", "clothes"], genitive: "sandals'", plural: "sandals" },
	{ word: "Socks", rarity: 1, groups: ["object", "item", "clothes"], genitive: "socks'", plural: "socks" },
	{ word: "Belt", rarity: 1, groups: ["object", "item", "clothes"], genitive: "belt's", plural: "belts" },
	{ word: "Sash", rarity: 1, groups: ["object", "item", "clothes"], genitive: "sash's", plural: "sashes" },
	{ word: "Scarf", rarity: 1, groups: ["object", "item", "clothes"], genitive: "scarf's", plural: "scarves" },

	// Weapons
	{ word: "Sword", rarity: 1, groups: ["object", "item", "weapon"], genitive: "sword's", plural: "swords" },
	{ word: "Dagger", rarity: 1, groups: ["object", "item", "weapon"], genitive: "dagger's", plural: "daggers" },
	{ word: "Knife", rarity: 1, groups: ["object", "item", "weapon"], genitive: "knife's", plural: "knives" },
	{ word: "Axe", rarity: 1, groups: ["object", "item", "weapon", "tool"], genitive: "axe's", plural: "axes" },
	{ word: "Mace", rarity: 1, groups: ["object", "item", "weapon"], genitive: "mace's", plural: "maces" },
	{ word: "Hammer", rarity: 1, groups: ["object", "item", "weapon", "tool"], genitive: "hammer's", plural: "hammers" },
	{ word: "Spear", rarity: 1, groups: ["object", "item", "weapon"], genitive: "spear's", plural: "spears" },
	{ word: "Staff", rarity: 1, groups: ["object", "item", "weapon"], genitive: "staff's", plural: "staffs" },
	{ word: "Bow", rarity: 1, groups: ["object", "item", "weapon"], genitive: "bow's", plural: "bows" },
	{ word: "Crossbow", rarity: 1, groups: ["object", "item", "weapon"], genitive: "crossbow's", plural: "crossbows" },
	{ word: "Sling", rarity: 1, groups: ["object", "item", "weapon"], genitive: "sling's", plural: "slings" },
	{ word: "Whip", rarity: 1, groups: ["object", "item", "weapon"], genitive: "whip's", plural: "whips" },
	{ word: "Flail", rarity: 1, groups: ["object", "item", "weapon"], genitive: "flail's", plural: "flails" },
	{ word: "Lance", rarity: 1, groups: ["object", "item", "weapon"], genitive: "lance's", plural: "lances" },
	{ word: "Halberd", rarity: 1, groups: ["object", "item", "weapon"], genitive: "halberd's", plural: "halberds" },
	{ word: "Pike", rarity: 1, groups: ["object", "item", "weapon"], genitive: "pike's", plural: "pikes" },
	{ word: "Club", rarity: 1, groups: ["object", "item", "weapon"], genitive: "club's", plural: "clubs" },

	// Instruments
	{ word: "Flute", rarity: 1, groups: ["object", "item", "instrument"], genitive: "flute's", plural: "flutes" },
	{ word: "Harp", rarity: 1, groups: ["object", "item", "instrument"], genitive: "harp's", plural: "harps" },
	{ word: "Lute", rarity: 1, groups: ["object", "item", "instrument"], genitive: "lute's", plural: "lutes" },
	{ word: "Lyre", rarity: 1, groups: ["object", "item", "instrument"], genitive: "lyre's", plural: "lyres" },
	{ word: "Drum", rarity: 1, groups: ["object", "item", "instrument"], genitive: "drum's", plural: "drums" },
	{ word: "Bagpipe", rarity: 1, groups: ["object", "item", "instrument"], genitive: "bagpipe's", plural: "bagpipes" },
	{ word: "Horn", rarity: 1, groups: ["object", "item", "instrument"], genitive: "horn's", plural: "horns" },
	{ word: "Panpipe", rarity: 1, groups: ["object", "item", "instrument"], genitive: "panpipe's", plural: "panpipes" },
	{ word: "Tambourine", rarity: 1, groups: ["object", "item", "instrument"], genitive: "tambourine's", plural: "tambourines" },
	{ word: "Violin", rarity: 1, groups: ["object", "item", "instrument"], genitive: "violin's", plural: "violins" },
	{ word: "Trumpet", rarity: 1, groups: ["object", "item", "instrument"], genitive: "trumpet's", plural: "trumpets" },

	// Armor
	{ word: "Helmet", rarity: 1, groups: ["object", "item", "armor"], genitive: "helmet's", plural: "helmets" },
	{ word: "Cuirass", rarity: 1, groups: ["object", "item", "armor"], genitive: "cuirass'", plural: "cuirasses" },
	{ word: "Breastplate", rarity: 1, groups: ["object", "item", "armor"], genitive: "breastplate's", plural: "breastplates" },
	{ word: "Gauntlets", rarity: 1, groups: ["object", "item", "armor"], genitive: "gauntlets'", plural: "gauntlets" },
	{ word: "Greaves", rarity: 1, groups: ["object", "item", "armor"], genitive: "greaves'", plural: "greaves" },
	{ word: "Sabatons", rarity: 1, groups: ["object", "item", "armor"], genitive: "sabatons'", plural: "sabatons" },
	{ word: "Pauldrons", rarity: 1, groups: ["object", "item", "armor"], genitive: "pauldrons'", plural: "pauldrons" },
	{ word: "Bracers", rarity: 1, groups: ["object", "item", "armor"], genitive: "bracers'", plural: "bracers" },
	{ word: "Shield", rarity: 1, groups: ["object", "item", "armor"], genitive: "shield's", plural: "shields" },

	// Tools
	{ word: "Pickaxe", rarity: 1, groups: ["object", "item", "tool", "mine"], genitive: "pickaxe's", plural: "pickaxes" },
	{ word: "Shovel", rarity: 1, groups: ["object", "item", "tool", "mine", "graveyard"], genitive: "shovel's", plural: "shovels" },
	{ word: "Saw", rarity: 1, groups: ["object", "item", "tool", "wood"], genitive: "saw's", plural: "saws" },
	{ word: "Chisel", rarity: 1, groups: ["object", "item", "tool", "stone"], genitive: "chisel's", plural: "chisels" },
	{ word: "Sickle", rarity: 1, groups: ["object", "item", "tool", "farm"], genitive: "sickle's", plural: "sickles" },
	{ word: "Scythe", rarity: 1, groups: ["object", "item", "tool", "farm"], genitive: "scythe's", plural: "scythes" },
	{ word: "Tongs", rarity: 1, groups: ["object", "item", "tool", "forge"], genitive: "tongs'", plural: "tongs" },
	{ word: "Screwdriver", rarity: 1, groups: ["object", "item", "tool"], genitive: "screwdriver's", plural: "screwdrivers" },
	{ word: "Wrench", rarity: 1, groups: ["object", "item", "tool", "forge"], genitive: "wrench's", plural: "wrenches" },
	{ word: "Flint", rarity: 2, groups: ["object", "item", "tool", "adventure"], genitive: "flint's", plural: "flints" },
	{ word: "Tinderbox", rarity: 2, groups: ["object", "item", "tool", "forge"], genitive: "tinderbox's", plural: "tinderboxes" },
	{ word: "Cauldron", rarity: 2, groups: ["object", "item", "tool", "alchemy"], genitive: "cauldron's", plural: "cauldrons" },
	{ word: "Bellows", rarity: 2, groups: ["object", "item", "tool", "forge"], genitive: "bellows'", plural: "bellows" },
	{ word: "Anvil", rarity: 2, groups: ["object", "item", "tool", "forge"], genitive: "anvil's", plural: "anvils" },

	// Minerals & Metals
	{ word: "Iron", rarity: 1, groups: ["object", "item", "mineral"], genitive: "iron's", plural: "iron" },
	{ word: "Bronze", rarity: 1, groups: ["object", "item", "mineral"], genitive: "bronze's", plural: "bronze" },
	{ word: "Copper", rarity: 1, groups: ["object", "item", "mineral"], genitive: "copper's", plural: "copper" },
	{ word: "Tin", rarity: 1, groups: ["object", "item", "mineral"], genitive: "tin's", plural: "tin" },
	{ word: "Silver", rarity: 1, groups: ["object", "item", "mineral"], genitive: "silver's", plural: "silver" },
	{ word: "Gold", rarity: 1, groups: ["object", "item", "mineral"], genitive: "gold's", plural: "gold" },
	{ word: "Platinum", rarity: 1, groups: ["object", "item", "mineral"], genitive: "platinum's", plural: "platinum" },
	{ word: "Mithril", rarity: 1, groups: ["object", "item", "mineral", "fantasy"], genitive: "mithril's", plural: "mithril" },
	{ word: "Adamantite", rarity: 1, groups: ["object", "item", "mineral", "fantasy"], genitive: "adamantite's", plural: "adamantite" },
	{ word: "Runite", rarity: 1, groups: ["object", "item", "mineral", "fantasy"], genitive: "runite's", plural: "runite" },
	{ word: "Coal", rarity: 1, groups: ["object", "item", "mineral"], genitive: "coal's", plural: "coal" },
	{ word: "Obsidian", rarity: 1, groups: ["object", "item", "mineral"], genitive: "obsidian's", plural: "obsidian" },

	// Gems
	{ word: "Diamond", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "diamond's", plural: "diamond" },
	{ word: "Ruby", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "ruby's", plural: "ruby" },
	{ word: "Emerald", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "emerald's", plural: "emerald" },
	{ word: "Sapphire", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "sapphire's", plural: "sapphire" },
	{ word: "Topaz", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "topaz's", plural: "topaz" },
	{ word: "Amethyst", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "amethyst's", plural: "amethyst" },
	{ word: "Opal", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "opal's", plural: "opal" },
	{ word: "Jade", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "jade's", plural: "jade" },
	{ word: "Pearl", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "pearl's", plural: "pearl" },
	{ word: "Garnet", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "garnet's", plural: "garnet" },
	{ word: "Aquamarine", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "aquamarine's", plural: "aquamarine" },
	{ word: "Peridot", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "peridot's", plural: "peridot" },
	{ word: "Citrine", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "citrine's", plural: "citrine" },
	{ word: "Tourmaline", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "tourmaline's", plural: "tourmaline" },
	{ word: "Onyx", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "onyx's", plural: "onyx" },
	{ word: "Turquoise", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "turquoise's", plural: "turquoise" },
	{ word: "Moonstone", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "moonstone's", plural: "moonstone" },
	{ word: "Sunstone", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "sunstone's", plural: "sunstone" },
	{ word: "Bloodstone", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "bloodstone's", plural: "bloodstone" },
	{ word: "Malachite", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "malachite's", plural: "malachite" },
	{ word: "Coral", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "coral's", plural: "coral" },
	{ word: "Amber", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "amber's", plural: "amber" },
	{ word: "Agate", rarity: 1, groups: ["object", "item", "mineral", "gem", "jewelry"], genitive: "agate's", plural: "agate" },

	// Adveturers gear
	{ word: "Blanket", rarity: 2, groups: ["object", "item", "adventure"], genitive: "blanket's", plural: "blanket" },
	{ word: "Bedroll", rarity: 2, groups: ["object", "item", "adventure"], genitive: "bedroll's", plural: "bedroll" },
	{ word: "Tent", rarity: 2, groups: ["object", "item", "adventure"], genitive: "tent's", plural: "tent" },

	// Food Ingredients
	{ word: "Flour", rarity: 2, groups: ["object", "item", "food"], genitive: "flour's", plural: "flour" },
	{ word: "Sugar", rarity: 2, groups: ["object", "item", "food"], genitive: "sugar's", plural: "sugar" },
	{ word: "Salt", rarity: 2, groups: ["object", "item", "food"], genitive: "salt's", plural: "salt" },
	{ word: "Pepper", rarity: 2, groups: ["object", "item", "food"], genitive: "pepper's", plural: "pepper" },
	{ word: "Cinnamon", rarity: 2, groups: ["object", "item", "food"], genitive: "cinnamon's", plural: "cinnamon" },
	{ word: "Nutmeg", rarity: 2, groups: ["object", "item", "food"], genitive: "nutmeg's", plural: "nutmeg" },
	{ word: "Ginger", rarity: 2, groups: ["object", "item", "food"], genitive: "ginger's", plural: "ginger" },
	{ word: "Clove", rarity: 2, groups: ["object", "item", "food"], genitive: "clove's", plural: "clove" },
	{ word: "Vanilla", rarity: 2, groups: ["object", "item", "food"], genitive: "vanilla's", plural: "vanilla" },
	{ word: "Cocoa", rarity: 2, groups: ["object", "item", "food"], genitive: "cocoa's", plural: "cocoa" },
	{ word: "Coffee", rarity: 2, groups: ["object", "item", "food"], genitive: "coffee's", plural: "coffee" },
	{ word: "Tea", rarity: 2, groups: ["object", "item", "food"], genitive: "tea's", plural: "tea" },
	{ word: "Milk", rarity: 2, groups: ["object", "item", "food"], genitive: "milk's", plural: "milk" },
	{ word: "Egg", rarity: 2, groups: ["object", "item", "food"], genitive: "egg's", plural: "egg" },
	{ word: "Butter", rarity: 2, groups: ["object", "item", "food"], genitive: "butter's", plural: "butter" },
	{ word: "Cheese", rarity: 2, groups: ["object", "item", "food"], genitive: "cheese's", plural: "cheese" },
	{ word: "Yogurt", rarity: 2, groups: ["object", "item", "food"], genitive: "yogurt's", plural: "yogurt" },
	{ word: "Cream", rarity: 2, groups: ["object", "item", "food"], genitive: "cream's", plural: "cream" },
	{ word: "Honey", rarity: 2, groups: ["object", "item", "food"], genitive: "honey's", plural: "honey" },
	{ word: "Syrup", rarity: 2, groups: ["object", "item", "food"], genitive: "syrup's", plural: "syrup" },
	{ word: "Oil", rarity: 2, groups: ["object", "item", "food"], genitive: "oil's", plural: "oil" },
	{ word: "Vinegar", rarity: 2, groups: ["object", "item", "food"], genitive: "vinegar's", plural: "vinegar" },
	{ word: "Pork", rarity: 2, groups: ["object", "item", "food"], genitive: "pork's", plural: "pork" },
	{ word: "Beef", rarity: 2, groups: ["object", "item", "food"], genitive: "beef's", plural: "beef" },
	{ word: "Chicken", rarity: 2, groups: ["object", "item", "food", "animal", "bird"], genitive: "chicken's", plural: "chicken" },
	{ word: "Fish", rarity: 2, groups: ["object", "item", "food", "animal", "fish"], genitive: "fish's", plural: "fish" },
	{ word: "Salmon", rarity: 2, groups: ["object", "item", "food", "animal", "fish"], genitive: "salmon's", plural: "salmon" },
	{ word: "Trout", rarity: 2, groups: ["object", "item", "food", "animal", "fish"], genitive: "trout's", plural: "trout" },
	{ word: "Tuna", rarity: 2, groups: ["object", "item", "food", "animal", "fish"], genitive: "tuna's", plural: "tuna" },
	{ word: "Shrimp", rarity: 2, groups: ["object", "item", "food", "animal", "fish"], genitive: "shrimp's", plural: "shrimp" },
	{ word: "Crab", rarity: 2, groups: ["object", "item", "food", "animal", "fish"], genitive: "crab's", plural: "crab" },
	{ word: "Lobster", rarity: 2, groups: ["object", "item", "food", "animal", "fish"], genitive: "lobster's", plural: "lobster" },
	{ word: "Oyster", rarity: 2, groups: ["object", "item", "food", "animal", "fish"], genitive: "oyster's", plural: "oyster" },
	{ word: "Lamb", rarity: 2, groups: ["object", "item", "food"], genitive: "lamb's", plural: "lamb" },
	{ word: "Mutton", rarity: 2, groups: ["object", "item", "food"], genitive: "mutton's", plural: "mutton" },
	{ word: "Venison", rarity: 2, groups: ["object", "item", "food"], genitive: "venison's", plural: "venison" },
	{ word: "Rabbit", rarity: 2, groups: ["object", "item", "food", "animal", "bird"], genitive: "rabbit's", plural: "rabbit" },
	{ word: "Goose", rarity: 2, groups: ["object", "item", "food", "animal", "bird"], genitive: "goose's", plural: "goose" },
	{ word: "Duck", rarity: 2, groups: ["object", "item", "food", "animal", "bird"], genitive: "duck's", plural: "duck" },
	{ word: "Turkey", rarity: 2, groups: ["object", "item", "food", "animal", "bird"], genitive: "turkey's", plural: "turkey" },

	// Alcoholic beverages
	{ word: "Wine", rarity: 2, groups: ["object", "item", "food", "drink", "alcohol"], genitive: "wine's", plural: "wine" },
	{ word: "Beer", rarity: 2, groups: ["object", "item", "food", "drink", "alcohol"], genitive: "beer's", plural: "beer" },
	{ word: "Ale", rarity: 2, groups: ["object", "item", "food", "drink", "alcohol"], genitive: "ale's", plural: "ale" },
	{ word: "Liquor", rarity: 3, groups: ["object", "item", "food", "drink", "alcohol"], genitive: "liquor's", plural: "liquor" },
	{ word: "Whiskey", rarity: 3, groups: ["object", "item", "food", "drink", "alcohol"], genitive: "whiskey's", plural: "whiskey" },
	{ word: "Rum", rarity: 3, groups: ["object", "item", "food", "drink", "alcohol"], genitive: "rum's", plural: "rum" },
	{ word: "Brandy", rarity: 3, groups: ["object", "item", "food", "drink", "alcohol"], genitive: "brandy's", plural: "brandy" },
	{ word: "Vodka", rarity: 4, groups: ["object", "item", "food", "drink", "alcohol"], genitive: "vodka's", plural: "vodka" },
	{ word: "Gin", rarity: 3, groups: ["object", "item", "food", "drink", "alcohol"], genitive: "gin's", plural: "gin" },
	{ word: "Sake", rarity: 4, groups: ["object", "item", "food", "drink", "alcohol"], genitive: "sake's", plural: "sake" },
	{ word: "Mead", rarity: 2, groups: ["object", "item", "food", "drink", "alcohol"], genitive: "mead's", plural: "mead" },
	{ word: "Cider", rarity: 2, groups: ["object", "item", "food", "drink", "alcohol"], genitive: "cider's", plural: "cider" },

	// Animals
	{ word: "Cat", rarity: 2, groups: ["object", "subjective", "item", "animal", "cat"], genitive: "cat's", plural: "cat" },
	{ word: "Dog", rarity: 2, groups: ["object", "subjective", "item", "animal", "dog"], genitive: "dog's", plural: "dog" },
	{ word: "Horse", rarity: 2, groups: ["object", "subjective", "item", "animal", "horse"], genitive: "horse's", plural: "horse" },
	{ word: "Cow", rarity: 2, groups: ["object", "subjective", "item", "animal", "cow"], genitive: "cow's", plural: "cow" },
	{ word: "Pig", rarity: 2, groups: ["object", "subjective", "item", "animal", "pig"], genitive: "pig's", plural: "pig" },
	{ word: "Sheep", rarity: 2, groups: ["object", "subjective", "item", "animal", "sheep"], genitive: "sheep's", plural: "sheep" },
	{ word: "Goat", rarity: 2, groups: ["object", "subjective", "item", "animal", "goat"], genitive: "goat's", plural: "goat" },

	// Birds
	{ word: "Pigeon", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "pigeon's", plural: "pigeon" },
	{ word: "Dove", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "dove's", plural: "dove" },
	{ word: "Crow", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "crow's", plural: "crow" },
	{ word: "Raven", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "raven's", plural: "raven" },
	{ word: "Swan", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "swan's", plural: "swan" },
	{ word: "Pheasant", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "pheasant's", plural: "pheasant" },
	{ word: "Partridge", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "partridge's", plural: "partridge" },
	{ word: "Quail", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "quail's", plural: "quail" },
	{ word: "Eagle", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "eagle's", plural: "eagle" },
	{ word: "Hawk", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "hawk's", plural: "hawk" },
	{ word: "Falcon", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "falcon's", plural: "falcon" },
	{ word: "Owl", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "owl's", plural: "owl" },
	{ word: "Vulture", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "vulture's", plural: "vulture" },
	{ word: "Stork", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "stork's", plural: "stork" },
	{ word: "Crane", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "crane's", plural: "crane" },
	{ word: "Pelican", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "pelican's", plural: "pelican" },
	{ word: "Flamingo", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "flamingo's", plural: "flamingo" },
	{ word: "Hummingbird", rarity: 2, groups: ["object", "subjective", "item", "animal", "bird"], genitive: "hummingbird's", plural: "hummingbird" },

	// Forest animals
	{ word: "Deer", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "deer's", plural: "deer" },
	{ word: "Elk", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "elk's", plural: "elk" },
	{ word: "Moose", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "moose's", plural: "moose" },
	{ word: "Bear", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "bear's", plural: "bear" },
	{ word: "Wolf", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "wolf's", plural: "wolf" },
	{ word: "Fox", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "fox's", plural: "fox" },
	{ word: "Raccoon", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "raccoon's", plural: "raccoon" },
	{ word: "Squirrel", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "squirrel's", plural: "squirrel" },
	{ word: "Rabbit", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "rabbit's", plural: "rabbit" },
	{ word: "Hedgehog", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "hedgehog's", plural: "hedgehog" },
	{ word: "Porcupine", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "porcupine's", plural: "porcupine" },
	{ word: "Skunk", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "skunk's", plural: "skunk" },
	{ word: "Badger", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "badger's", plural: "badger" },
	{ word: "Beaver", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "beaver's", plural: "beaver" },
	{ word: "Otter", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "otter's", plural: "otter" },
	{ word: "Mink", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "mink's", plural: "mink" },
	{ word: "Weasel", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "weasel's", plural: "weasel" },
	{ word: "Marten", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "marten's", plural: "marten" },
	{ word: "Lynx", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "lynx's", plural: "lynx" },
	{ word: "Bobcat", rarity: 2, groups: ["object", "subjective", "item", "animal", "forest"], genitive: "bobcat's", plural: "bobcat" },

	// Fruits & Berries
	{ word: "Apple", rarity: 2, groups: ["object", "item", "fruit"], genitive: "apple's", plural: "apple" },
	{ word: "Pear", rarity: 2, groups: ["object", "item", "fruit"], genitive: "pear's", plural: "pear" },
	{ word: "Plum", rarity: 2, groups: ["object", "item", "fruit"], genitive: "plum's", plural: "plum" },
	{ word: "Peach", rarity: 2, groups: ["object", "item", "fruit"], genitive: "peach's", plural: "peach" },
	{ word: "Cherry", rarity: 2, groups: ["object", "item", "fruit"], genitive: "cherry's", plural: "cherry" },
	{ word: "Apricot", rarity: 2, groups: ["object", "item", "fruit"], genitive: "apricot's", plural: "apricot" },
	{ word: "Orange", rarity: 2, groups: ["object", "item", "fruit"], genitive: "orange's", plural: "orange" },
	{ word: "Lemon", rarity: 2, groups: ["object", "item", "fruit"], genitive: "lemon's", plural: "lemon" },
	{ word: "Lime", rarity: 2, groups: ["object", "item", "fruit"], genitive: "lime's", plural: "lime" },
	{ word: "Grape", rarity: 2, groups: ["object", "item", "fruit"], genitive: "grape's", plural: "grape" },
	{ word: "Raisin", rarity: 2, groups: ["object", "item", "fruit"], genitive: "raisin's", plural: "raisin" },
	{ word: "Currant", rarity: 2, groups: ["object", "item", "fruit"], genitive: "currant's", plural: "currant" },
	{ word: "Blueberry", rarity: 2, groups: ["object", "item", "fruit"], genitive: "blueberry's", plural: "blueberry" },
	{ word: "Blackberry", rarity: 2, groups: ["object", "item", "fruit"], genitive: "blackberry's", plural: "blackberry" },
	{ word: "Raspberry", rarity: 2, groups: ["object", "item", "fruit"], genitive: "raspberry's", plural: "raspberry" },
	{ word: "Strawberry", rarity: 2, groups: ["object", "item", "fruit"], genitive: "strawberry's", plural: "strawberry" },
	{ word: "Cranberry", rarity: 2, groups: ["object", "item", "fruit"], genitive: "cranberry's", plural: "cranberry" },
	{ word: "Gooseberry", rarity: 2, groups: ["object", "item", "fruit"], genitive: "gooseberry's", plural: "gooseberry" },
	{ word: "Elderberry", rarity: 2, groups: ["object", "item", "fruit"], genitive: "elderberry's", plural: "elderberry" },
	{ word: "Bilberry", rarity: 2, groups: ["object", "item", "fruit"], genitive: "bilberry's", plural: "bilberry" },
	{ word: "Huckleberry", rarity: 2, groups: ["object", "item", "fruit"], genitive: "huckleberry's", plural: "huckleberry" },
	{ word: "Cranberry", rarity: 2, groups: ["object", "item", "fruit"], genitive: "cranberry's", plural: "cranberry" },
	{ word: "Cloudberry", rarity: 2, groups: ["object", "item", "fruit"], genitive: "cloudberry's", plural: "cloudberry" },
	{ word: "Lingonberry", rarity: 2, groups: ["object", "item", "fruit"], genitive: "lingonberry's", plural: "lingonberry" },

	// Animal parts
	{ word: "Antler", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "antler's", plural: "antler" },
	{ word: "Horn", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "horn's", plural: "horn" },
	{ word: "Tusk", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "tusk's", plural: "tusk" },
	{ word: "Claw", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "claw's", plural: "claw" },
	{ word: "Fang", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "fang's", plural: "fang" },
	{ word: "Tooth", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "tooth's", plural: "tooth" },
	{ word: "Tail", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "tail's", plural: "tail" },
	{ word: "Paw", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "paw's", plural: "paw" },
	{ word: "Hoof", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "hoof's", plural: "hoof" },
	{ word: "Wing", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "wing's", plural: "wing" },
	{ word: "Feather", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "feather's", plural: "feather" },
	{ word: "Scale", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "scale's", plural: "scale" },
	{ word: "Shell", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "shell's", plural: "shell" },
	{ word: "Fin", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "fin's", plural: "fin" },
	{ word: "Beak", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "beak's", plural: "beak" },
	{ word: "Hive", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "hive's", plural: "hive" },
	{ word: "Stinger", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "stinger's", plural: "stinger" },
	{ word: "Sting", rarity: 2, groups: ["object", "item", "animal", "part"], genitive: "sting's", plural: "sting" },

	// Alchemy
	{ word: "Potion", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "potion's", plural: "potions" },
	{ word: "Elixir", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "elixir's", plural: "elixirs" },
	{ word: "Tonic", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "tonic's", plural: "tonics" },
	{ word: "Philter", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "philter's", plural: "philters" },
	{ word: "Remedy", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "remedy's", plural: "remedies" },
	{ word: "Panacea", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "panacea's", plural: "panaceas" },
	{ word: "Salve", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "salve's", plural: "salves" },
	{ word: "Ointment", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "ointment's", plural: "ointments" },
	{ word: "Balm", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "balm's", plural: "balms" },
	{ word: "Liniment", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "liniment's", plural: "liniments" },
	{ word: "Draught", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "draught's", plural: "draughts" },
	{ word: "Draft", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "draft's", plural: "drafts" },
	{ word: "Tincture", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "tincture's", plural: "tinctures" },
	{ word: "Extract", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "extract's", plural: "extracts" },
	{ word: "Essence", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "essence's", plural: "essences" },
	{ word: "Concoction", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "concoction's", plural: "concoctions" },
	{ word: "Mixture", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "mixture's", plural: "mixtures" },
	{ word: "Solution", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "solution's", plural: "solutions" },
	{ word: "Poultice", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "poultice's", plural: "poultices" },
	{ word: "Dose", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "dose's", plural: "doses" },
	{ word: "Pill", rarity: 2, groups: ["object", "item", "alchemy", "product"], genitive: "pill's", plural: "pills" },

	// Ingredients (alchemy)
	{ word: "Root", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "root's", plural: "roots" },
	{ word: "Herb", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "herb's", plural: "herbs" },
	{ word: "Leaf", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "leaf's", plural: "leaves" },
	{ word: "Bark", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "bark's", plural: "barks" },
	{ word: "Seed", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "seed's", plural: "seeds" },
	{ word: "Berry", rarity: 2, groups: ["object", "item", "alchemy", "ingredient", "food", "berry"], genitive: "berry's", plural: "berries" },
	{ word: "Fruit", rarity: 2, groups: ["object", "item", "alchemy", "ingredient", "food", "fruit"], genitive: "fruit's", plural: "fruits" },
	{ word: "Flower", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "flower's", plural: "flowers" },
	{ word: "Petal", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "petal's", plural: "petals" },
	{ word: "Pollen", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "pollen's", plural: "pollens" },
	{ word: "Mushroom", rarity: 2, groups: ["object", "item", "alchemy", "ingredient", "food"], genitive: "mushroom's", plural: "mushrooms" },
	{ word: "Fungus", rarity: 2, groups: ["object", "item", "alchemy", "ingredient", "food"], genitive: "fungus's", plural: "fungi" },
	{ word: "Moss", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "moss's", plural: "mosses" },
	{ word: "Lichen", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "lichen's", plural: "lichens" },
	{ word: "Slime", rarity: 2, groups: ["object", "item", "alchemy", "ingredient", "negative"], genitive: "slime's", plural: "slimes" },
	{ word: "Goo", rarity: 2, groups: ["object", "item", "alchemy", "ingredient", "negative"], genitive: "goo's", plural: "goos" },
	{ word: "Gel", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "gel's", plural: "gels" },
	{ word: "Resin", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "resin's", plural: "resins" },
	{ word: "Sap", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "sap's", plural: "saps" },
	{ word: "Juice", rarity: 2, groups: ["object", "item", "alchemy", "ingredient", "drink", "food"], genitive: "juice's", plural: "juices" },
	{ word: "Nectar", rarity: 2, groups: ["object", "item", "alchemy", "ingredient", "drink", "food"], genitive: "nectar's", plural: "nectars" },
	{ word: "Oil", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "oil's", plural: "oils" },
	{ word: "Saliva", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "saliva's", plural: "salivas" },
	{ word: "Venom", rarity: 2, groups: ["object", "item", "alchemy", "ingredient", "negative"], genitive: "venom's", plural: "venoms" },
	{ word: "Poison", rarity: 2, groups: ["object", "item", "alchemy", "ingredient", "negative"], genitive: "poison's", plural: "poisons" },
	{ word: "Toxin", rarity: 2, groups: ["object", "item", "alchemy", "ingredient", "negative"], genitive: "toxin's", plural: "toxins" },
	{ word: "Acid", rarity: 2, groups: ["object", "item", "alchemy", "ingredient", "negative"], genitive: "acid's", plural: "acids" },
	{ word: "Vinegar", rarity: 2, groups: ["object", "item", "alchemy", "ingredient"], genitive: "vinegar's", plural: "vinegars" },

	// Glassware (alchemy)
	{ word: "Vial", rarity: 2, groups: ["object", "item", "alchemy", "glass"], genitive: "vial's", plural: "vials" },
	{ word: "Flask", rarity: 2, groups: ["object", "item", "alchemy", "glass"], genitive: "flask's", plural: "flasks" },
	{ word: "Bottle", rarity: 2, groups: ["object", "item", "alchemy", "glass"], genitive: "bottle's", plural: "bottles" },
	{ word: "Phial", rarity: 2, groups: ["object", "item", "alchemy", "glass"], genitive: "phial's", plural: "phials" },
	{ word: "Ampule", rarity: 2, groups: ["object", "item", "alchemy", "glass"], genitive: "ampule's", plural: "ampules" },

	// Glassware (non-alchemy)
	{ word: "Glass", rarity: 2, groups: ["object", "item", "glass"], genitive: "glass's", plural: "glass" },
	{ word: "Goblet", rarity: 2, groups: ["object", "item", "glass"], genitive: "goblet's", plural: "goblets" },
	{ word: "Chalice", rarity: 2, groups: ["object", "item", "glass"], genitive: "chalice's", plural: "chalices" },
	{ word: "Cup", rarity: 2, groups: ["object", "item", "glass"], genitive: "cup's", plural: "cups" },
	{ word: "Bowl", rarity: 2, groups: ["object", "item", "glass"], genitive: "bowl's", plural: "bowls" },
	{ word: "Plate", rarity: 2, groups: ["object", "item", "glass"], genitive: "plate's", plural: "plates" },
	{ word: "Dish", rarity: 2, groups: ["object", "item", "glass"], genitive: "dish's", plural: "dishes" },

	// Forest
	{ word: "Forest", rarity: 2, groups: ["object", "location", "forest"], genitive: "forest's", plural: "forest" },
	{ word: "Wood", rarity: 2, groups: ["object", "location", "forest"], genitive: "wood's", plural: "wood" },
	{ word: "Grove", rarity: 2, groups: ["object", "location", "forest"], genitive: "grove's", plural: "grove" },
	{ word: "Copse", rarity: 2, groups: ["object", "location", "forest"], genitive: "copse's", plural: "copse" },
	{ word: "Thicket", rarity: 2, groups: ["object", "location", "forest"], genitive: "thicket's", plural: "thicket" },
	{ word: "Coppice", rarity: 2, groups: ["object", "location", "forest"], genitive: "coppice's", plural: "coppice" },
	{ word: "Shaw", rarity: 2, groups: ["object", "location", "forest"], genitive: "shaw's", plural: "shaw" },
	{ word: "Spinney", rarity: 2, groups: ["object", "location", "forest"], genitive: "spinney's", plural: "spinney" },
	{ word: "Stand", rarity: 2, groups: ["object", "location", "forest"], genitive: "stand's", plural: "stand" },
	{ word: "Timberland", rarity: 2, groups: ["object", "location", "forest"], genitive: "timberland's", plural: "timberland" },
	{ word: "Woods", rarity: 2, groups: ["object", "location", "forest"], genitive: "woods's", plural: "woods" },
	{ word: "Wildwood", rarity: 2, groups: ["object", "location", "forest"], genitive: "wildwood's", plural: "wildwood" },
	{ word: "Jungle", rarity: 2, groups: ["object", "location", "forest"], genitive: "jungle's", plural: "jungle" },
	{ word: "Rainforest", rarity: 2, groups: ["object", "location", "forest"], genitive: "rainforest's", plural: "rainforest" },
	{ word: "Woodland", rarity: 2, groups: ["object", "location", "forest"], genitive: "woodland's", plural: "woodland" },
	{ word: "Forestland", rarity: 2, groups: ["object", "location", "forest"], genitive: "forestland's", plural: "forestland" },

	// Mountain
	{ word: "Mountain", rarity: 2, groups: ["object", "location", "mountain"], genitive: "mountain's", plural: "mountain" },
	{ word: "Hill", rarity: 2, groups: ["object", "location", "mountain"], genitive: "hill's", plural: "hill" },
	{ word: "Peak", rarity: 2, groups: ["object", "location", "mountain"], genitive: "peak's", plural: "peak" },
	{ word: "Ridge", rarity: 2, groups: ["object", "location", "mountain"], genitive: "ridge's", plural: "ridge" },
	{ word: "Range", rarity: 2, groups: ["object", "location", "mountain"], genitive: "range's", plural: "range" },
	{ word: "Alp", rarity: 2, groups: ["object", "location", "mountain"], genitive: "alp's", plural: "alp" },
	{ word: "Alps", rarity: 2, groups: ["object", "location", "mountain"], genitive: "alps's", plural: "alps" },
	{ word: "Cordillera", rarity: 2, groups: ["object", "location", "mountain"], genitive: "cordillera's", plural: "cordillera" },
	{ word: "Cordilleras", rarity: 2, groups: ["object", "location", "mountain"], genitive: "cordilleras's", plural: "cordilleras" },
	{ word: "Sierra", rarity: 2, groups: ["object", "location", "mountain"], genitive: "sierra's", plural: "sierra" },
	{ word: "Sierras", rarity: 2, groups: ["object", "location", "mountain"], genitive: "sierras's", plural: "sierras" },
	{ word: "Volcano", rarity: 2, groups: ["object", "location", "mountain"], genitive: "volcano's", plural: "volcano" },

	// Desert
	{ word: "Desert", rarity: 2, groups: ["object", "location", "desert"], genitive: "desert's", plural: "desert" },
	{ word: "Dune", rarity: 2, groups: ["object", "location", "desert"], genitive: "dune's", plural: "dune" },
	{ word: "Dunes", rarity: 2, groups: ["object", "location", "desert"], genitive: "dunes's", plural: "dunes" },
	{ word: "Waste", rarity: 2, groups: ["object", "location", "desert"], genitive: "waste's", plural: "waste" },
	{ word: "Wasteland", rarity: 2, groups: ["object", "location", "desert"], genitive: "wasteland's", plural: "wasteland" },
	{ word: "Badlands", rarity: 2, groups: ["object", "location", "desert"], genitive: "badlands's", plural: "badlands" },
	{ word: "Wilderness", rarity: 2, groups: ["object", "location", "desert"], genitive: "wilderness's", plural: "wilderness" },
	{ word: "Wilds", rarity: 2, groups: ["object", "location", "desert"], genitive: "wilds's", plural: "wilds" },
	{ word: "Outback", rarity: 2, groups: ["object", "location", "desert"], genitive: "outback's", plural: "outback" },
	{ word: "Oasis", rarity: 2, groups: ["object", "location", "desert"], genitive: "oasis's", plural: "oasis" },

	// Plains
	{ word: "Plain", rarity: 2, groups: ["object", "location", "plain"], genitive: "plain's", plural: "plain" },
	{ word: "Plains", rarity: 2, groups: ["object", "location", "plain"], genitive: "plains's", plural: "plains" },
	{ word: "Grassland", rarity: 2, groups: ["object", "location", "plain"], genitive: "grassland's", plural: "grassland" },
	{ word: "Steppe", rarity: 2, groups: ["object", "location", "plain"], genitive: "steppe's", plural: "steppe" },
	{ word: "Prairie", rarity: 2, groups: ["object", "location", "plain"], genitive: "prairie's", plural: "prairie" },
	{ word: "Savanna", rarity: 2, groups: ["object", "location", "plain"], genitive: "savanna's", plural: "savanna" },
	{ word: "Savannah", rarity: 2, groups: ["object", "location", "plain"], genitive: "savannah's", plural: "savannah" },
	{ word: "Veld", rarity: 2, groups: ["object", "location", "plain"], genitive: "veld's", plural: "veld" },
	{ word: "Veldt", rarity: 2, groups: ["object", "location", "plain"], genitive: "veldt's", plural: "veldt" },
	{ word: "Tundra", rarity: 2, groups: ["object", "location", "plain"], genitive: "tundra's", plural: "tundra" },
	{ word: "Taiga", rarity: 2, groups: ["object", "location", "plain"], genitive: "taiga's", plural: "taiga" },
	{ word: "Pampas", rarity: 2, groups: ["object", "location", "plain"], genitive: "pampas's", plural: "pampas" },

	// Swamp
	{ word: "Swamp", rarity: 2, groups: ["object", "location", "swamp"], genitive: "swamp's", plural: "swamp" },
	{ word: "Marsh", rarity: 2, groups: ["object", "location", "swamp"], genitive: "marsh's", plural: "marsh" },
	{ word: "Bog", rarity: 2, groups: ["object", "location", "swamp"], genitive: "bog's", plural: "bog" },
	{ word: "Fen", rarity: 2, groups: ["object", "location", "swamp"], genitive: "fen's", plural: "fen" },
	{ word: "Wetland", rarity: 2, groups: ["object", "location", "swamp"], genitive: "wetland's", plural: "wetland" },
	{ word: "Wetlands", rarity: 2, groups: ["object", "location", "swamp"], genitive: "wetlands's", plural: "wetlands" },

	// Underwater
	{ word: "Ocean", rarity: 2, groups: ["object", "location", "underwater"], genitive: "ocean's", plural: "ocean" },
	{ word: "Sea", rarity: 2, groups: ["object", "location", "underwater"], genitive: "sea's", plural: "sea" },
	{ word: "Lake", rarity: 2, groups: ["object", "location", "underwater"], genitive: "lake's", plural: "lake" },
	{ word: "River", rarity: 2, groups: ["object", "location", "underwater"], genitive: "river's", plural: "river" },
	{ word: "Stream", rarity: 2, groups: ["object", "location", "underwater"], genitive: "stream's", plural: "stream" },
	{ word: "Creek", rarity: 2, groups: ["object", "location", "underwater"], genitive: "creek's", plural: "creek" },
	{ word: "Brook", rarity: 2, groups: ["object", "location", "underwater"], genitive: "brook's", plural: "brook" },
	{ word: "Pond", rarity: 2, groups: ["object", "location", "underwater"], genitive: "pond's", plural: "pond" },

	// Verbs
	{ word: "Make", rarity: 2, groups: ["verb"], past: "Made", continues: "Making" },

	{ word: "Hunt", rarity: 2, groups: ["verb", "occupation"], past: "Hunted", continues: "Hunting" },
	{ word: "Fish", rarity: 2, groups: ["verb", "occupation"], past: "Fished", continues: "Fishing" },
	{ word: "Farm", rarity: 2, groups: ["verb", "occupation"], past: "Farmed", continues: "Farming" },
	{ word: "Gather", rarity: 2, groups: ["verb", "occupation"], past: "Gathered", continues: "Gathering" },
	{ word: "Forage", rarity: 2, groups: ["verb", "occupation"], past: "Foraged", continues: "Foraging" },
	{ word: "Mine", rarity: 2, groups: ["verb", "occupation"], past: "Mined", continues: "Mining" },
	{ word: "Craft", rarity: 2, groups: ["verb", "occupation"], past: "Crafted", continues: "Crafting" },
	{ word: "Construct", rarity: 2, groups: ["verb", "occupation"], past: "Constructed", continues: "Constructing" },
	{ word: "Work", rarity: 2, groups: ["verb", "occupation"], past: "Worked", continues: "Working" },
	{ word: "Build", rarity: 2, groups: ["verb", "occupation"], past: "Built", continues: "Building" },
	{ word: "Create", rarity: 2, groups: ["verb", "occupation"], past: "Created", continues: "Creating" },

	{ word: "Dance", rarity: 2, groups: ["verb", "leisure"], past: "Danced", continues: "Dancing" },
	{ word: "Sing", rarity: 2, groups: ["verb", "leisure"], past: "Sang", continues: "Singing" },
	{ word: "Play", rarity: 2, groups: ["verb", "leisure"], past: "Played", continues: "Playing" },
	{ word: "Sleep", rarity: 2, groups: ["verb", "leisure"], past: "Slept", continues: "Sleeping" },
	{ word: "Dream", rarity: 2, groups: ["verb", "leisure"], past: "Dreamt", continues: "Dreaming" },

	{ word: "Drink", rarity: 2, groups: ["verb", "leisure", "drink"], past: "Drank", continues: "Drinking" },
	{ word: "Eat", rarity: 2, groups: ["verb", "leisure", "food"], past: "Ate", continues: "Eating" },

	{ word: "Fight", rarity: 2, groups: ["verb", "fight", "person"], past: "Fought", continues: "Fighting" },
	{ word: "Kill", rarity: 2, groups: ["verb", "fight", "negative", "death", "person"], past: "Killed", continues: "Killing" },
	{ word: "Attack", rarity: 2, groups: ["verb", "fight"], past: "Attacked", continues: "Attacking" },
	{ word: "Defend", rarity: 2, groups: ["verb", "fight", "positive"], past: "Defended", continues: "Defending" },
	{ word: "Protect", rarity: 2, groups: ["verb", "fight", "positive"], past: "Protected", continues: "Protecting" },
	{ word: "War", rarity: 2, groups: ["verb", "fight"], past: "Warred", continues: "Warring" },
	{ word: "Battle", rarity: 2, groups: ["verb", "fight"], past: "Battled", continues: "Battling" },
	{ word: "Raid", rarity: 2, groups: ["verb", "fight"], past: "Raided", continues: "Raiding" },
	{ word: "Slaughter", rarity: 2, groups: ["verb", "fight", "death", "negative", "person", "animal"], past: "Slaughtered", continues: "Slaughtering" },
	{ word: "Destroy", rarity: 2, groups: ["verb", "negative", "building"], past: "Destroyed", continues: "Destroying" },

	{ word: "Run", rarity: 2, groups: ["verb", "move"], past: "Ran", continues: "Running" },
	{ word: "Walk", rarity: 2, groups: ["verb", "move"], past: "Walked", continues: "Walking" },
	{ word: "Swim", rarity: 2, groups: ["verb", "move", "water"], past: "Swam", continues: "Swimming", edparticiple: "Swum" },
	{ word: "Climb", rarity: 2, groups: ["verb", "move"], past: "Climbed", continues: "Climbing" },
	{ word: "Jump", rarity: 2, groups: ["verb", "move", "air"], past: "Jumped", continues: "Jumping" },
	{ word: "Fly", rarity: 2, groups: ["verb", "move", "air"], past: "Flew", continues: "Flying" },
	{ word: "Fall", rarity: 2, groups: ["verb", "move", "air"], past: "Fell", continues: "Falling" },
	{ word: "Crawl", rarity: 2, groups: ["verb", "move", "earth"], past: "Crawled", continues: "Crawling" },
	{ word: "Dig", rarity: 2, groups: ["verb", "move", "earth"], past: "Dug", continues: "Digging" },

	{ word: "Die", rarity: 2, groups: ["verb", "death", "person", "negative"], past: "Died", continues: "Dying", edparticiple: "Dead" },
	{ word: "Live", rarity: 2, groups: ["verb", "person", "positive", "life"], past: "Lived", continues: "Living", edparticiple: "Alive" },

	{ word: "Love", rarity: 2, groups: ["verb", "person", "emotion", "positive"], past: "Loved", continues: "Loving" },
	{ word: "Hate", rarity: 2, groups: ["verb", "person", "emotion", "negative"], past: "Hated", continues: "Hating" },
	{ word: "Fear", rarity: 2, groups: ["verb", "person", "emotion", "negative"], past: "Feared", continues: "Fearing" },
	{ word: "Hope", rarity: 2, groups: ["verb", "person", "emotion", "positive"], past: "Hoped", continues: "Hoping" },
	{ word: "Believe", rarity: 2, groups: ["verb", "person", "positive", "religious"], past: "Believed", continues: "Believing" },

	{ word: "Think", rarity: 2, groups: ["verb", "person", "brains"], past: "Thought", continues: "Thinking" },
	{ word: "Know", rarity: 2, groups: ["verb", "person", "brains"], past: "Knew", continues: "Knowing", edparticiple: "Known" },
	{ word: "Learn", rarity: 2, groups: ["verb", "person", "brains"], past: "Learnt", continues: "Learning" },
	{ word: "Teach", rarity: 2, groups: ["verb", "person", "brains"], past: "Taught", continues: "Teaching" },
	{ word: "Understand", rarity: 2, groups: ["verb", "person", "brains"], past: "Understood", continues: "Understanding" },
	{ word: "Forget", rarity: 2, groups: ["verb", "person", "brains", "negative"], past: "Forgot", continues: "Forgetting", edparticiple: "Forgotten" },
	{ word: "Remember", rarity: 2, groups: ["verb", "person", "brains"], past: "Remembered", continues: "Remembering" },
	{ word: "Guess", rarity: 2, groups: ["verb", "person", "brains"], past: "Guessed", continues: "Guessing" },
	{ word: "Wish", rarity: 2, groups: ["verb", "person", "brains"], past: "Wished", continues: "Wishing" },
	{ word: "Want", rarity: 2, groups: ["verb", "person", "brains"], past: "Wanted", continues: "Wanting" },
	{ word: "Speak", rarity: 2, groups: ["verb", "person", "mouth"], past: "Spoke", continues: "Speaking", edparticiple: "Spoken" },

	{ word: "See", rarity: 2, groups: ["verb", "sense", "eye"], past: "Saw", continues: "Seeing", edparticiple: "Seen" },
	{ word: "Hear", rarity: 2, groups: ["verb", "sense", "ear"], past: "Heard", continues: "Hearing" },
	{ word: "Smell", rarity: 2, groups: ["verb", "sense", "nose", "air"], past: "Smelt", continues: "Smelling" },
	{ word: "Taste", rarity: 2, groups: ["verb", "sense", "tongue"], past: "Tasted", continues: "Tasting" },
	{ word: "Touch", rarity: 2, groups: ["verb", "sense", "hand"], past: "Touched", continues: "Touching" },
	{ word: "Feel", rarity: 2, groups: ["verb", "sense", "hand"], past: "Felt", continues: "Feeling" },
	{ word: "Breathe", rarity: 2, groups: ["verb", "life", "air", "nose"], past: "Breathed", continues: "Breathing" },
];
