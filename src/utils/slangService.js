import slangData from '../slang.json';

/**
 * Get slang definition from local dictionary or Urban Dictionary API
 * @param {string} term - The slang term to look up
 * @returns {Promise<Object>} Normalized slang definition object
 */
export async function getSlangDefinition(term) {
  if (!term || typeof term !== 'string') {
    throw new Error('Invalid term provided');
  }

  const normalizedTerm = term.toLowerCase().trim();

  // First, try to find in local slang.json
  const localDefinition = findInLocalDictionary(normalizedTerm);
  if (localDefinition) {
    return localDefinition;
  }

  // If not found locally, try Urban Dictionary API
  try {
    const urbanDefinition = await getFromUrbanDictionary(normalizedTerm);
    if (urbanDefinition) {
      return urbanDefinition;
    }
  } catch (error) {
    console.warn('Urban Dictionary API failed:', error.message);
  }

  // If neither source has the term, return null
  return null;
}

/**
 * Search for term in local slang.json
 * @param {string} normalizedTerm - Normalized term to search for
 * @returns {Object|null} Local definition or null if not found
 */
function findInLocalDictionary(normalizedTerm) {
  try {
    // Handle different possible JSON structures
    let slangList = [];
    
    if (Array.isArray(slangData)) {
      slangList = slangData;
    } else if (slangData.slang && Array.isArray(slangData.slang)) {
      slangList = slangData.slang;
    } else {
      return null;
    }

    // Search for exact match first
    let match = slangList.find(item => {
      const itemTerm = (item.term || item.phrase || '').toLowerCase().trim();
      return itemTerm === normalizedTerm;
    });

    // If no exact match, try partial matches
    if (!match) {
      match = slangList.find(item => {
        const itemTerm = (item.term || item.phrase || '').toLowerCase().trim();
        return itemTerm.includes(normalizedTerm) || normalizedTerm.includes(itemTerm);
      });
    }

    if (match) {
      return normalizeLocalDefinition(match);
    }
  } catch (error) {
    console.warn('Error searching local dictionary:', error);
  }

  return null;
}

/**
 * Normalize local dictionary definition to standard format
 * @param {Object} item - Raw dictionary item
 * @returns {Object} Normalized definition
 */
function normalizeLocalDefinition(item) {
  return {
    term: item.term || item.phrase || '',
    translation: item.translation || item.meaning || '',
    context: item.context || 'casual',
    example: item.example || '',
    source: 'local'
  };
}

/**
 * Get definition from Urban Dictionary API
 * @param {string} term - Term to search for
 * @returns {Promise<Object|null>} Normalized definition or null
 */
async function getFromUrbanDictionary(term) {
  try {
    const response = await fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);
    
    if (!response.ok) {
      throw new Error(`Urban Dictionary API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.list || data.list.length === 0) {
      return null;
    }

    // Get the first definition (usually the most popular)
    const firstDefinition = data.list[0];
    
    // Clean and normalize the definition
    return normalizeUrbanDefinition(firstDefinition, term);
  } catch (error) {
    console.error('Urban Dictionary API request failed:', error);
    throw error;
  }
}

/**
 * Normalize Urban Dictionary response to standard format
 * @param {Object} urbanDef - Raw Urban Dictionary definition
 * @param {string} originalTerm - Original search term
 * @returns {Object} Normalized definition
 */
function normalizeUrbanDefinition(urbanDef, originalTerm) {
  // Clean the definition text
  let cleanDefinition = urbanDef.definition || '';
  
  // Remove [brackets] and clean up text
  cleanDefinition = cleanDefinition
    .replace(/\[([^\]]+)\]/g, '$1') // Remove brackets but keep content
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Clean the example text
  let cleanExample = urbanDef.example || '';
  cleanExample = cleanExample
    .replace(/\[([^\]]+)\]/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  // Filter out NSFW content
  const nsfwKeywords = ['nsfw', 'adult', 'explicit', 'sexual', 'vulgar', 'profanity'];
  const hasNsfwContent = nsfwKeywords.some(keyword => 
    cleanDefinition.toLowerCase().includes(keyword) || 
    cleanExample.toLowerCase().includes(keyword)
  );

  if (hasNsfwContent) {
    return null; // Don't return NSFW content
  }

  // Limit translation to 1-2 clean sentences for parents
  const sentences = cleanDefinition.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let limitedDefinition = sentences.slice(0, 2).join('. ').trim();
  
  // Add period if missing
  if (limitedDefinition && !limitedDefinition.endsWith('.')) {
    limitedDefinition += '.';
  }

  // Determine context based on content
  let context = 'casual';
  if (cleanDefinition.toLowerCase().includes('cool') || cleanDefinition.toLowerCase().includes('awesome')) {
    context = 'positive';
  } else if (cleanDefinition.toLowerCase().includes('bad') || cleanDefinition.toLowerCase().includes('terrible')) {
    context = 'negative';
  } else if (cleanDefinition.toLowerCase().includes('warning') || cleanDefinition.toLowerCase().includes('careful')) {
    context = 'warning';
  }

  return {
    term: originalTerm,
    translation: limitedDefinition || 'No clear definition available.',
    context: context,
    example: cleanExample || '',
    source: 'urban-dictionary'
  };
}

/**
 * Batch lookup multiple terms
 * @param {Array<string>} terms - Array of terms to look up
 * @returns {Promise<Array>} Array of results
 */
export async function getMultipleSlangDefinitions(terms) {
  if (!Array.isArray(terms)) {
    throw new Error('Terms must be an array');
  }

  const results = [];
  
  for (const term of terms) {
    try {
      const definition = await getSlangDefinition(term);
      results.push({
        term,
        definition,
        success: !!definition
      });
    } catch (error) {
      results.push({
        term,
        definition: null,
        success: false,
        error: error.message
      });
    }
  }

  return results;
}

/**
 * Search for terms containing a substring
 * @param {string} searchTerm - Term to search for
 * @returns {Array} Array of matching terms from local dictionary
 */
export function searchLocalSlang(searchTerm) {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return [];
  }

  try {
    let slangList = [];
    
    if (Array.isArray(slangData)) {
      slangList = slangData;
    } else if (slangData.slang && Array.isArray(slangData.slang)) {
      slangList = slangData.slang;
    } else {
      return [];
    }

    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    return slangList
      .filter(item => {
        const itemTerm = (item.term || item.phrase || '').toLowerCase();
        const itemTranslation = (item.translation || item.meaning || '').toLowerCase();
        return itemTerm.includes(normalizedSearch) || itemTranslation.includes(normalizedSearch);
      })
      .map(item => normalizeLocalDefinition(item))
      .slice(0, 10); // Limit to 10 results
  } catch (error) {
    console.warn('Error searching local slang:', error);
    return [];
  }
}
