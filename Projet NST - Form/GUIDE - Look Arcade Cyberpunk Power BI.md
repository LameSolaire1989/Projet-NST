# Look Arcade Cyberpunk pour Power BI

## 1. Appliquer le thème

1. Ouvrez votre rapport dans **Power BI Desktop**.
2. Menu **Affichage** (View) → **Thèmes** → **Parcourir les thèmes**.
3. Sélectionnez le fichier **`Power BI - Theme Arcade Cyberpunk.json`**.
4. Le thème est appliqué à tout le rapport.

**Contenu actuel du thème :** palette néon (dataColors), fond et texte (background, foreground), accent des tableaux (tableAccent), couleurs sémantiques KPI (good, neutral, bad), et **fond de page sombre** (#0D0D14) via visualStyles. Pour le reste du look arcade (bordures cyan, fond des visuels, etc.), suivez la section 3 ci‑dessous.

---

## 2. Couleurs du thème (référence)


| Usage       | Code hex  | Aperçu          |
| ----------- | --------- | --------------- |
| Fond        | `#0D0D14` | Noir bleuté     |
| Fond cartes | `#16162A` | Bleu très foncé |
| Texte       | `#E0E0FF` | Lavande clair   |
| Accent néon | `#00FFF9` | Cyan néon       |
| Secondaire  | `#FF00FF` | Magenta         |
| Or / score  | `#FFE600` | Jaune néon      |
| Positif     | `#39FF14` | Vert néon       |
| Négatif     | `#FF006E` | Rose vif        |


---

## 3. Réglages manuels pour renforcer le look arcade

### Page du rapport

- **Arrière-plan de la page** : laissez celui du thème ou choisissez une image (grille, néons, pixel art).
- **Format de la page** : 16:9 ou format personnalisé type écran vertical si vous affichez sur un écran à côté de la borne.

### Visuels (graphiques, cartes, tableaux)

- **Arrière-plan** : Transparence à 0, couleur `#0D0D14` ou `#16162A`.
- **Bordure** : Activée, couleur `#00FFF9` (cyan), épaisseur 1–2 px.
- **Ombre** : Légère ombre portée pour donner du relief.

### Titres et textes

- **Titres de visuels** : Police **Segoe UI Bold** (ou **Consolas** pour un côté plus “tech”), couleur **#00FFF9** (cyan).
- **Labels / données** : **#E0E0FF** pour rester lisible sur fond sombre.

### Cartes (KPI / score)

- Utilisez **#00FFF9** ou **#FFE600** pour la valeur du score.
- Taille de police généreuse (24–36 pt) pour un effet “arcade”.

### Slicers (filtres)

- En-tête en **#00FFF9**, fond **#16162A**.
- Options en **#E0E0FF** sur fond **#0D0D14**.

### Tableaux (ex. leaderboard)

- Lignes alternées : **#0D0D14** et **#16162A**.
- En-têtes en **#00FFF9**, texte des cellules en **#E0E0FF**.
- Grille discrète en **#1E1E2E**.

---

## 4. Polices recommandées

- **Titres** : Segoe UI Bold, Consolas Bold ou Rajdhani (si installée).
- **Données** : Segoe UI.
- **Effet “rétro arcade”** : installez une police style pixel (ex. **Press Start 2P**) et utilisez-la pour le titre principal ou le Top 1 du leaderboard.

---

## 5. Idées d’arrière-plan

- Fond uni **#0D0D14** (déjà dans le thème).
- Image de fond : grille néon, circuit imprimé, ou texture “arcade” en basse opacité (10–15 %) pour ne pas nuire à la lisibilité.

---

## 6. En cas de problème

- Si une couleur ne s’applique pas, vérifiez que le visuel n’a pas un format personnalisé qui écrase le thème (Format → réinitialiser si besoin).
- Après import du thème, vous pouvez encore ajuster manuellement chaque visuel pour affiner le rendu arcade/cyberpunk.

