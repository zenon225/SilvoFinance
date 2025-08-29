import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  FileText,
  Building,
  Globe,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const LegalMentions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec bouton de retour */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        {/* En-tête de la page */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Mentions Légales
          </h1>
          <p className="text-gray-600 text-center">
            Dernière mise à jour : 15 janvier 2024
          </p>
        </div>

        {/* Contenu des mentions légales */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Éditeur du site */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 text-blue-600 mr-2" />
              1. Éditeur du site
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="font-medium text-gray-900">Silvo Finance SA</p>
              <p className="text-gray-600 mt-2">
                Société Anonyme au capital de 5 000 000 XOF
              </p>
              <p className="text-gray-600">RCCM: CI-ABJ-2023-B-12345</p>
              <p className="text-gray-600">NIF: 1234567890</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Rue du Commerce, Plateau, Abidjan, Côte d'Ivoire
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">+225 27 21 23 45 67</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">legal@silvo-finance.com</span>
                </div>
              </div>
            </div>
          </section>

          {/* Directeur de publication */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 text-blue-600 mr-2" />
              2. Directeur de publication
            </h2>
            <p className="text-gray-600">
              Monsieur Jean Koffi, Président du Directoire de Silvo Finance SA.
            </p>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 text-blue-600 mr-2" />
              3. Hébergement
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="font-medium text-gray-900">
                Amazon Web Services (AWS)
              </p>
              <p className="text-gray-600 mt-2">
                38 Avenue John F. Kennedy, L-1855 Luxembourg
              </p>
              <p className="text-gray-600">Numéro de TVA: LU26375245</p>
              <p className="text-gray-600">
                Site web:{" "}
                <a
                  href="https://aws.amazon.com"
                  className="text-blue-600 hover:underline"
                >
                  https://aws.amazon.com
                </a>
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Propriété intellectuelle
            </h2>
            <p className="text-gray-600 mb-4">
              L'ensemble des éléments constituant le site silvo-finance.com
              (textes, images, vidéos, logos, marques, etc.) sont la propriété
              exclusive de Silvo Finance SA ou font l'objet d'une autorisation
              d'utilisation.
            </p>
            <p className="text-gray-600">
              Toute reproduction, représentation, modification, publication,
              adaptation de tout ou partie des éléments du site, quel que soit
              le moyen ou le procédé utilisé, est interdite sans autorisation
              préalable de Silvo Finance SA.
            </p>
          </section>

          {/* Protection des données */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Protection des données personnelles
            </h2>
            <p className="text-gray-600 mb-4">
              Conformément au Règlement Général sur la Protection des Données
              (RGPD) et à la loi n°2013-450 du 19 juin 2013 relative à la
              protection des données personnelles en Côte d'Ivoire, Silvo
              Finance SA s'engage à protéger la vie privée de ses utilisateurs.
            </p>
            <p className="text-gray-600 mb-4">
              Les données personnelles collectées sur le site sont traitées pour
              la gestion des comptes clients, l'exécution des services souscrits
              et à des fins de prospection commerciale.
            </p>
            <p className="text-gray-600">
              Vous disposez d'un droit d'accès, de rectification, d'opposition
              et de suppression des données vous concernant. Pour exercer ces
              droits, veuillez contacter notre Délégué à la Protection des
              Données à l'adresse :{" "}
              <a
                href="mailto:dpd@silvo-finance.com"
                className="text-blue-600 hover:underline"
              >
                dpd@silvo-finance.com
              </a>
              .
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. Cookies
            </h2>
            <p className="text-gray-600 mb-4">
              Le site silvo-finance.com utilise des cookies pour améliorer
              l'expérience utilisateur, analyser le trafic et personnaliser le
              contenu.
            </p>
            <p className="text-gray-600">
              En naviguant sur notre site, vous acceptez l'utilisation des
              cookies conformément à notre politique en la matière. Vous pouvez
              modifier vos préférences à tout moment dans les paramètres de
              votre navigateur.
            </p>
          </section>

          {/* Limitations de responsabilité */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              7. Limitations de responsabilité
            </h2>
            <p className="text-gray-600 mb-4">
              Silvo Finance SA s'efforce d'assurer l'exactitude et la mise à
              jour des informations diffusées sur son site. Cependant, Silvo
              Finance SA ne peut garantir l'exactitude, la précision ou
              l'exhaustivité des informations made available sur son site.
            </p>
            <p className="text-gray-600">
              L'utilisateur reconnaît utiliser les informations under his own
              responsibility. Silvo Finance SA ne pourra être tenue responsable
              pour toute interruption du site, survenue de bugs, ou pour toute
              inexactitude ou omission concernant les informations disponibles
              sur le site.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              8. Droit applicable
            </h2>
            <p className="text-gray-600 mb-4">
              Les présentes mentions légales sont régies par le droit ivoirien.
              En cas de litige, les tribunaux d'Abidjan seront seuls compétents.
            </p>
            <p className="text-gray-600">
              Silvo Finance SA est agréée par la BCEAO (Banque Centrale des
              États de l'Afrique de l'Ouest) en tant qu'établissement de monnaie
              électronique, sous le numéro d'agrément BCEAO-EME-2023-045.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-blue-50 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Questions sur nos mentions légales ?
            </h2>
            <p className="text-gray-600 mb-4">
              Notre équipe juridique est à votre disposition pour toute question
              concernant nos mentions légales.
            </p>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-blue-600 mr-3" />
              <a
                href="mailto:legal@silvo-finance.com"
                className="text-blue-600 hover:underline font-medium"
              >
                legal@silvo-finance.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalMentions;
