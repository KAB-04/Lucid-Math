export const getTeachingStyleDescription = (style: string) => {
  const normalizedStyle = style.toLowerCase()

  if (normalizedStyle.includes('inquiry')) {
    return 'Lucid will guide you using questions and discovery before giving the answer.'
  }

  if (normalizedStyle.includes('direct')) {
    return 'Lucid will explain the method clearly, then help you practise it.'
  }

  if (normalizedStyle.includes('problem')) {
    return 'Lucid will start from realistic problems and build the method from there.'
  }

  if (normalizedStyle.includes('visual') || normalizedStyle.includes('example')) {
    return 'Lucid will lean on examples, patterns, and visual structure.'
  }

  if (normalizedStyle.includes('guided')) {
    return 'Lucid will give small prompts so you can discover the next step yourself.'
  }

  return 'Lucid will adapt explanations as your learner profile becomes more complete.'
}
