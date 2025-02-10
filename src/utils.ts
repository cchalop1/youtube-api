import { readFile, writeFile } from "fs/promises";

export async function cleanVTT(inputPath: string, outputPath: string) {
  try {
    // Lire le fichier VTT
    const vttContent = await readFile(inputPath, "utf-8");

    // Séparer en lignes et filtrer
    const cleanedLines = vttContent
      .split("\n")
      .map((line) => line.trim()) // Supprimer les espaces autour
      .filter((line) => line && !line.includes("-->")) // Supprimer horodatages
      .map(
        (line) =>
          line
            .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, "") // Supprimer horodatages dans le texte
            .replace(/<\/?c>/g, "") // Supprimer balises <c> et </c>
      );

    // Supprimer les doublons tout en conservant l'ordre des phrases
    const uniqueLines = [...new Set(cleanedLines)];

    // Écrire dans un fichier propre
    await writeFile(outputPath, uniqueLines.join("\n"), "utf-8");
    console.log(
      `✅ Texte nettoyé et sans doublons sauvegardé dans : ${outputPath}`
    );
  } catch (error) {
    console.error("❌ Erreur lors du traitement du fichier :", error);
  }
}
