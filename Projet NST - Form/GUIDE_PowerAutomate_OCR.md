# Guide de Configuration : Flux Power Automate (Validation Score IA)

Ce guide détaille pas à pas comment configurer votre flux Power Automate existant pour intégrer la validation par Intelligence Artificielle (OCR) de l'image Base64 envoyée depuis le formulaire.

## 1. Mise à jour du déclencheur HTTP

Votre flux commence par le déclencheur **Lors de la réception d'une requête HTTP**. 
Il faut lui indiquer qu'une nouvelle variable (`photoBase64`) va arriver.

1. Cliquez sur le déclencheur pour l'ouvrir.
2. Cliquez sur le bouton **Générer à partir de l'échantillon**.
3. Collez ce code JSON complet et cliquez sur Terminé :

```json
{
  "NomComplet": "Jean Dupont",
  "Courriel": "jean@test.com",
  "CommissionScolaire": "CSS de Montréal",
  "DejaClientNST": "Oui",
  "DejaClientRoboPack": "Non",
  "ScoreObtenu": 450000,
  "SourceFormulaire": "Kiosque Arcade",
  "photoBase64": "data:image/jpeg;base64,/9j/4AAQSk..."
}
```

> **Note :** Power Automate aura maintenant accès à la variable dynamique `photoBase64`.

## 2. Conversion du Base64 (L'astuce cruciale)

> **Attention ⚠️ :** La fonction JavaScript `toDataURL()` envoie l'image avec une en-tête spéciale (`data:image/jpeg;base64,`). La formule classique `base64ToBinary()` plantera si elle lit cette en-tête. Tu dois obligatoirement utiliser **`dataUriToBinary`**.

1. Créez une nouvelle action **Composer** (Opération sur les données).
2. Dans le champ "Entrées", allez dans l'onglet **Expression**.
3. Tapez exactement cette formule (validez avec OK) :

```text
dataUriToBinary(triggerBody()?['photoBase64'])
```

*Cette action "Composer" contient maintenant le fichier image propre, lisible pour l'IA et SharePoint.*

## 3. Analyse OCR (AI Builder)

1. Ajoutez l'action **Reconnaître du texte dans une image ou un document PDF** (Premium - AI Builder).
2. Cliquez sur le champ d'image à envoyer.
3. Dans le menu de contenu dynamique, choisissez les **Sorties** (Output) de l'action de l'Étape 2.

## 4. Logique de Validation (Le Cœur du Système)

Nous allons vérifier si l'OCR a bien "lu" le score tapé par l'utilisateur.

1. Ajoutez l'action de contrôle **Condition**.
2. **Champ de gauche (Valeur 1) :** Sélectionnez *Lignes de texte extraites* ou *Texte complet* (venant de AI Builder). *Note : Si Power Automate met cette condition dans une boucle "Appliquer à chacun", c'est normal, laissez-le faire.*
3. **Opérateur (Milieu) :** Choisissez **`contient`** (ou `contains`).
4. **Champ de droite (Valeur 2) :** Sélectionnez la variable `ScoreObtenu` venant du déclencheur HTTP.

## 5. Mise à jour SharePoint & Preuve

Selon le résultat de la Condition, vous allez modifier la colonne d'état de votre SharePoint.

### SI OUI (Condition Vraie)
1. Ajoutez l'action **Mettre à jour l'élément** (SharePoint). Changez la colonne "Statut" pour `Validé par IA ✅`.
2. Ajoutez l'action **Ajouter une pièce jointe** (SharePoint). 
   - **ID** : L'ID de l'élément créé.
   - **Nom du fichier** : `Preuve_Score_@{triggerBody()?['NomComplet']}.jpg`
   - **Contenu du fichier** : Sélectionnez les **Sorties** de l'Étape 2 (le binaire).

### SI NON (Condition Fausse)
1. Même logique : **Mettre à jour l'élément** (SharePoint). Changez la colonne "Statut" pour `Vérification manuelle 🛑`.
2. Ajoutez quand même l'image de preuve (binaire en pièce jointe). Ainsi, si l'IA s'est trompée à cause d'un reflet sur l'écran, un humain pourra ouvrir l'élément SharePoint, regarder la photo et valider le pointage manuellement.
