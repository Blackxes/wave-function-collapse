/**
 * @File File Content
 *
 * @Author Alexander Bassov Sun Jul 03 2022
 * @Email blackxes.dev@gmail.com
 */

// @todo fix all typescript errors

export const getFormData = (formElement) => {
  const formData = new FormData(formElement);
  let data = {};

  for (const item of formData.entries()) {
    data[item[0]] = item[1];
  }

  return data;
};

/**
 * Takes the given action type and converts it into a "handled" action type
 * Another saga can listen to this type and check if the "put" action has been completed
 */
export const getHandledActionType = (type) => type + "/handled";

/**
 * Returns an application title combined with the given value
 */
// export const getDocumentTitle = (title = "") =>
//     [process?.env?.APP_TITLE || "", title].filter(Boolean).join(" | ");

export const handleApiResponseObjects = (callbackForSingleObject, data) =>
  data?.map((item) => callbackForSingleObject(item));

export const createBlankDataSet = (type, defaults = {}) => ({
  ...defaults,
});

/**
 * generates a simple hash string - dont use this for as password hash!
 * this is by far one of the worst id generations for passwords
 *
 * @param int length - defines the length of the hash string
 * @param string chars - chars from which this function will pick characters
 * 	to generate the hash
 *
 * @return string - the generated hash
 */
const g_defaultHashChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export const generateHashString = (length = 8, chars = g_defaultHashChars) => {
  let hash = "";

  while (length > hash.length)
    hash += chars.charAt(Math.floor(Math.random() * chars.length));

  return hash;
};

/**
 * generates a section id
 * eg. [1, 2, 3] would eventually generate f-42-l0l
 *
 * @param int sections - defines the number of sections for the id
 * @param int sectionLength - defines the length of each section
 *
 * @return string - returns a string based on the given params
 */
const g_defaultSections = [16];

export const generateId = (sections = g_defaultSections) => {
  return sections
    .map((length) => {
      return generateHashString(length);
    })
    .join("-");
};

/**
 * Generates a random color hash
 */
export const randomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

/**
 * Returns a promise after its resolve a response object is returned
 * @see https://picsum.photos/
 */
export const getRandomImage = (width, height) => {
  // I split the code here because of clarity
  const url = `https://picsum.photos/${width}/${height ?? width}`;
  const paramsString = `random=${Math.floor(Math.random() * 25)}`;

  return fetch(url + "?" + paramsString);
};

/**
 * joins an array of values to a string separated by a given separator and ignores null/undefined
 * additionally when an index is an array based on the first index of that array
 * the value of the second index is used or when false the backup value in the third index is used
 *
 * a perfect use for this would be for a className string
 * since null/undefined are getting filtered out
 *
 * [true, A] == A
 * [true, A, B] == A
 * [false, A, B] == B
 * [false, A] == ''
 *
 * @param array strings - array of strings which will be joined
 * @param string (optional) separator - used separator
 *
 * @return string
 * 	- empty string when strings is not an array
 * 	- joined string
 */
export const joinStrings = (strings, separator = " ") => {
  if (!strings || strings.constructor != Array) {
    return "";
  }

  // prettier-ignore
  return strings
		  .map((item) => {
			  return !item
				  ? false
				  : item.constructor == Array
					  ? item[0]
						  ? item[1]
						  : item[2] || false
					  : item;
		  })
		  .filter(Boolean)
		  .join(separator);
};

/**
 * Keyifies a string by lowercasing the string and replacing every
 * character into the one defined within the ASCII charset
 *
 * @param string string - the string which will be keyified
 * @param bool replaceDash - defines whether a dash shall be used
 * 	to replace white spaces / default is underscore
 *
 * @return keyified string
 */
export const keyifyString = (string, useDash = true) => {
  if (typeof string != "string") {
    return "";
  }

  let keyified = string.toLowerCase();
  let whiteSpaceReplacement = useDash ? "-" : "_";

  return keyified.replace(/[-_]|\s+/g, whiteSpaceReplacement);
};

/**
 * Falls back on an empty string if false
 */
export const stringFallback = (condition: boolean, returnValue: any) =>
  condition ? returnValue : "";

/**
 * Converts an underscore string to camelcase
 */
export const underscoreToCamelCase = (string) => {
  return [...string].reduce(
    (camelCased, char, index) =>
      (camelCased +=
        char == "_"
          ? ""
          : string.at(index - 1) == "_"
          ? char.toUpperCase()
          : char),
    ""
  );
};

/**
 * Inserts a new item into a scope inside an object
 */
export const insertScopedItemInObject = (state, scope, item) => ({
  ...state,
  [scope]: [...state[scope], item],
});

/**
 * Overrides an item inside a scope of an object
 */
export const setScopedItemInObject = (
  state,
  scope,
  key,
  keyValue,
  newItem
) => ({
  ...state,
  [scope]: state.map((item) => (item[key] == keyValue ? newItem : item)),
});

/**
 * Updates an item in the state
 */
export const updateScopedItemInObject = (
  state,
  scope,
  key,
  keyValue,
  values
) => ({
  ...state,
  [scope]: state.map((item) =>
    item[key] == keyValue ? { ...item, ...values } : item
  ),
});

/**
 * Deletes an item inside a scope of an object
 */
export const deleteScopedItemFromObject = (state, scope, key, keyValue) => ({
  ...state,
  [scope]: state.filter((item) => item[key] == keyValue),
});

/**
 * Returns an item from a scope in an object
 */
export const getScopedItemFromObject = (state, scope, key, keyValue) =>
  getObjectItemFromArray(state[scope], key, keyValue);

/**
 * Shorthand for the find object by key in array function
 */
export const getObjectItemFromArray = (array, key, keyValue) =>
  array.find((item) => item[key] == keyValue);

/**
 * Returns a function which debounces a function call
 *
 * @param {string} callbackKey An identifier to know what function callback to throttle
 * @param {function} callback The actual throttled callback
 * @param {int} throttle_ms Duration of the throttle in milliseconds
 */
export const debounced = (callback, ms = 1000) => {
  let timeoutId = 0;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), ms) as unknown as number;
  };
};

/**
 * filters an array by key
 */
export function filterByProperty<R>(
  array: R[],
  value: any,
  key: string = "key"
): R[] {
  return array.filter((item) => item[key as keyof typeof item] == value);
}
// export const filterByKey = (array: object[], key: string, value: any): typeof array =>
//     array.filter((item) => item[key] == value);

export function findByProperty<R>(
  array: R[],
  value: any,
  key: string = "key"
): R {
  return array.find((item) => item[key as keyof typeof item] == value);
}

/**
 * Stringifies an objects values
 */
export function stringifyObject<T extends object>(obj: T) {
  return Object.keys(obj).reduce(
    (newObj, key) => (newObj[key] = JSON.stringify(obj[key])),
    {}
  );
}
