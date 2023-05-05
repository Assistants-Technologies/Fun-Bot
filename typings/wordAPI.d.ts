type WordUsage = {
    documentId: number
    exampleId: number
    id: number
    provider: {
        id: number
        name: string
    }
    rating: number
    score: {
        baseWordScore: number
        docTermCount: number
        id: number
        lemma: string
        partOfSpeech: string
        position: number
        score: number
        sentenceId: number
        stopword: boolean
        word: string
        wordType: string
    }
    sentence: {
        display: string
        documentMetadataId: number
        hasScoredWords: boolean
        id: number
        rating: number
        scoredWords: any[] // You can replace this with a more specific type if needed
    }
    text: string | string[]
    title: string
    url: string
    word: string
    year: number
}

type WordDefinition = {
    attributionText: string
    attributionUrl: string
    citations: any[] // You can replace this with a more specific type if needed
    exampleUses: any[] // You can replace this with a more specific type if needed
    extendedText: string
    labels: any[] // You can replace this with a more specific type if needed
    notes: any[] // You can replace this with a more specific type if needed
    partOfSpeech: string
    relatedWords: any[] // You can replace this with a more specific type if needed
    score: number
    seqString: string
    sequence: string
    sourceDictionary: string
    text: string | string[]
    textProns: any[] // You can replace this with a more specific type if needed
    word: string
}[]

type RandomWord = {
    canonicalForm: string
    id: number
    originalWord: string
    suggestions: string[]
    vulgar: string
    word: string
}

export { WordUsage, WordDefinition, RandomWord }
