import React from 'react';

export function PrivacyPolicyPage() {
  return (
    <div className="bg-light-bg min-h-screen text-light-text">
      <section className="py-16 lg:py-20 container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Politique de confidentialité</h1>
        <p className="text-light-text-muted text-sm mb-10">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-sm md:prose-base max-w-none space-y-8 text-light-text-secondary leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">1. Données collectées</h2>
            <p>Nous collectons les données que vous nous transmettez directement, notamment :</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Via le formulaire de contact : nom, email, téléphone, entreprise, message, service et budget indicatif souhaités</li>
              <li>Via votre espace client : nom, email, téléphone, entreprise, ainsi que les projets, devis, factures et messages échangés avec notre équipe</li>
              <li>Via l'inscription à la newsletter : votre adresse email</li>
              <li>Lors d'un paiement en ligne : les données nécessaires sont traitées directement par nos prestataires de paiement (Stripe, FedaPay) — Nomeryc n'a jamais accès à vos coordonnées bancaires complètes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">2. Finalité du traitement</h2>
            <p>Vos données sont utilisées exclusivement pour :</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Répondre à vos demandes de contact et de devis</li>
              <li>Assurer le suivi de vos projets, devis et factures</li>
              <li>Vous envoyer les communications relatives à votre compte (confirmation, réinitialisation de mot de passe, notifications)</li>
              <li>Vous envoyer notre newsletter, si vous y êtes inscrit — vous pouvez vous désabonner à tout moment via le lien présent dans chaque email</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">3. Conservation des données</h2>
            <p>
              Vos données sont conservées pendant toute la durée de la relation commerciale, puis archivées
              conformément aux obligations légales et comptables applicables. Les données des demandes de contact
              non converties en client sont conservées 24 mois maximum.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">4. Partage des données</h2>
            <p>
              Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec nos prestataires
              techniques strictement nécessaires au fonctionnement du service (hébergement, envoi d'emails,
              prestataires de paiement Stripe et FedaPay), dans le respect de leurs propres engagements de
              confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">5. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques appropriées pour protéger vos données : connexions
              chiffrées (HTTPS), mots de passe hachés, accès restreint aux données sensibles, jetons d'authentification
              à durée limitée.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">6. Vos droits</h2>
            <p>
              Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données.
              Pour exercer ces droits, contactez-nous à <a href="mailto:contact@nomeryc.com" className="text-brand-purple hover:underline">contact@nomeryc.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">7. Cookies</h2>
            <p>
              Ce site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement
              (authentification, préférences de session). Aucun cookie publicitaire ou de traçage tiers n'est utilisé.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
