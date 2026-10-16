import React from 'react';

export function LegalNoticePage() {
  return (
    <div className="bg-light-bg min-h-screen text-light-text">
      <section className="py-16 lg:py-20 container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Mentions légales</h1>
        <p className="text-light-text-muted text-sm mb-10">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-sm md:prose-base max-w-none space-y-8 text-light-text-secondary leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">1. Éditeur du site</h2>
            <p>
              Le présent site est édité par <strong>Nomeryc</strong>, entreprise de services numériques
              (développement web, mobile et automatisation) basée à Lomé, Togo.
            </p>
            <p className="mt-2 text-sm italic text-light-text-muted">
              [À compléter : forme juridique, numéro d'immatriculation (RCCM), adresse complète du siège,
              numéro de contribuable unique (NIF)]
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">2. Contact</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email : contact@nomeryc.com</li>
              <li>Téléphone / WhatsApp : +228 91 78 29 47</li>
              <li>Adresse : Lomé, Togo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">3. Hébergement</h2>
            <p className="text-sm italic text-light-text-muted">
              [À compléter : nom, adresse et contact de l'hébergeur du site et de l'infrastructure serveur]
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur ce site (textes, images, logos, identité visuelle, code source)
              est la propriété exclusive de Nomeryc, sauf mention contraire. Toute reproduction, représentation,
              modification ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">5. Responsabilité</h2>
            <p>
              Nomeryc s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site,
              mais ne peut garantir l'absence d'erreur ou d'omission. L'utilisateur reconnaît utiliser ces
              informations sous sa responsabilité exclusive.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">6. Liens externes</h2>
            <p>
              Ce site peut contenir des liens vers des sites tiers. Nomeryc n'exerce aucun contrôle sur ces sites
              et décline toute responsabilité quant à leur contenu.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-light-text mb-2">7. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit togolais. Tout litige relatif à leur
              interprétation ou leur exécution relève de la compétence exclusive des juridictions togolaises.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
