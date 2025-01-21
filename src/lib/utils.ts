export const cleanMarkdown = (text: string) => {
    return text
        .replace(/\*\*/g, '')  // Remove **
        .replace(/^##\s*/gm, '') // Clean headers
        .replace(/\n\*/g, '\n•') // Convert * lists to bullets
        .trim();
};