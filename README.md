# Bidly

Bidly est une application mobile d'encheres simples realisee avec React Native, Expo et TypeScript.

L'objectif du projet est de permettre a un utilisateur de consulter des objets mis aux encheres, rechercher un objet, ouvrir le detail d'une enchere, placer une offre, suivre ses offres, vendre un objet et recevoir une notification interne lorsqu'un autre utilisateur surencherit.

## Etat actuel

La version actuelle utilise Supabase comme source de donnees unique.

Si Supabase n'est pas configure ou si le chargement echoue, l'application affiche un message d'erreur. Il n'y a pas de jeu de donnees local de secours.

Les encheres, les offres, le suivi et les notifications sont branches sur Supabase quand l'utilisateur est connecte.

## Fonctionnalites

- Liste des encheres
- Inscription et connexion email/password avec Supabase Auth
- Creation d'une enchere par un utilisateur connecte
- Ajout d'une image lors de la creation d'une enchere
- Suppression d'une vente par son vendeur
- Recherche par mot-cle
- Detail d'une enchere
- Placement d'une offre
- Validation du montant de l'offre
- Blocage des offres sur une enchere terminee
- Blocage des offres sur sa propre vente
- Suivi des encheres dans `Mes offres`
- Notification interne lorsqu'un autre utilisateur surencherit
- Navigation par onglets avec Expo Router

## Installation

Ce projet est prevu pour Node.js 20 avec `nvm`.

Avant d'installer ou de lancer le projet, verifier la version de Node :

```bash
nvm use
node -v
```

La commande doit utiliser la version indiquee dans `.nvmrc`. Si `which node` affiche
`/usr/local/bin/node`, fermer puis rouvrir le terminal et relancer `nvm use`.

Installer les dependances :

```bash
npm install
```

## Lancement

Demarrer le projet pour Expo Go :

```bash
npm start
```

Cette commande lance Expo en mode mobile. Il faut scanner le QR code avec Expo Go.
Le lien `localhost:8081` correspond au serveur Metro, pas a la version web de l'application.

Pour ouvrir l'application dans un navigateur :

```bash
npm run web
```

## Probleme de lancement

Si Expo reste bloque et que le QR code ne s'affiche pas :

1. Arreter le terminal avec `Ctrl+C`.
2. Verifier qu'aucun ancien serveur Expo ne tourne :

```bash
lsof -nP -iTCP:8081 -sTCP:LISTEN
```

3. Revenir sur la version Node du projet :

```bash
nvm use
```

4. Relancer Expo avec le cache vide :

```bash
npx expo start -c
```

Si le probleme continue apres un changement de dependances :

```bash
rm -rf node_modules .expo
npm install
npm start
```

## Configuration

Pour charger les encheres depuis Supabase, creer un fichier `.env` a la racine avec :

```txt
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Ne jamais mettre de service role key dans l'application Expo.

## .env

Donnée du .env pour connecter supabase : voir dans le mail de remise

OU

## Preparation Supabase

Les fichiers SQL sont dans le dossier `supabase/`.

Pour preparer la base :

1. Creer un projet Supabase.
2. Ouvrir le SQL Editor.
3. Executer `supabase/schema.sql`.
4. Executer `supabase/seed.sql` si des donnees de demo sont souhaitees.

Le schema utilise Supabase Auth et Row Level Security.

Les tables principales sont :

- `profiles`
- `auction_items`
- `bids`
- `notifications`

Les colonnes utilisateur utilisent des `uuid` lies a `auth.users`. Les policies RLS permettent :

- la lecture publique des encheres actives ;
- la creation et modification de profil par l'utilisateur connecte ;
- la creation d'encheres par un utilisateur connecte ;
- la suppression d'une enchere uniquement par son vendeur ;
- l'insertion d'offres par l'utilisateur connecte ;
- la lecture et modification de ses propres notifications.

Le placement d'une offre passe par la fonction SQL `place_bid`. Elle verifie que l'enchere est active, que le montant est valide, que l'utilisateur n'est pas le vendeur, insere l'offre, met a jour le prix actuel et cree une notification pour l'ancien meilleur encherisseur si besoin.

Les donnees de `seed.sql` creent seulement des encheres publiques. Les offres et notifications sont creees par l'application pendant la demo.

Pour une demo rapide, il est possible de desactiver la confirmation email dans Supabase Auth. Sinon, l'utilisateur devra confirmer son email avant de se connecter.

## Parcours de demo

1. Ouvrir l'application.
2. Consulter la liste des encheres.
3. Rechercher un objet par mot-cle.
4. Se connecter et creer une nouvelle enchere avec une image.
5. Ouvrir sa propre enchere et verifier que le bouton d'offre est bloque.
6. Verifier que le vendeur peut supprimer sa propre vente.
7. Ouvrir le detail d'une autre enchere.
8. Essayer de placer une offre trop basse.
9. Placer une offre valide.
10. Aller dans `Mes offres` pour verifier le suivi.
11. Avec Supabase, se connecter avec un deuxieme compte pour surencherir.
12. Aller dans `Notifications` pour voir la notification de surenchere.
13. Ouvrir une enchere terminee et verifier que le bouton d'offre est bloque.

## Structure du projet

```txt
app/
  (tabs)/
    index.tsx
    my-bids.tsx
    notifications.tsx
  auction/
    [id].tsx
  create-auction.tsx
  login.tsx
  register.tsx
components/
  AuctionCard.tsx
context/
  AuthContext.tsx
  AuctionContext.tsx
services/
  auctionsService.ts
  bidsService.ts
  notificationsService.ts
  profilesService.ts
  supabase.ts
supabase/
  schema.sql
  seed.sql
types/
  auction.ts
utils/
  auctionStatus.ts
  formatDate.ts
  formatPrice.ts
```

## Verification

Commandes utilisees pour verifier le projet :

```bash
npm run lint
npx tsc --noEmit
```

## Limites actuelles

- Avec Supabase, la surenchere se teste avec deux comptes utilisateurs.
- Les images ajoutees depuis l'appareil sont stockees simplement dans le champ image de l'enchere pour garder le projet facile a presenter.
- Il n'y a pas de paiement ou de livraison.

Ces limites sont volontaires pour garder une premiere version simple, stable et explicable.
