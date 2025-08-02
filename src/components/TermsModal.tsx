import React from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  type: 'terms' | 'privacy';
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ type, onClose }) => {
  const content = {
    terms: {
      title: "Conditions Générales d'Utilisation",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">1. Acceptation des conditions</h3>
          <p>
            En utilisant les services de Silvo Finance, vous acceptez pleinement et sans réserve les présentes Conditions Générales d'Utilisation.
          </p>

          <h3 className="text-xl font-bold">2. Description du service</h3>
          <p>
            Silvo Finance est une plateforme d'investissement en ligne offrant des solutions financières innovantes en FCFA.
          </p>

          <h3 className="text-xl font-bold">3. Engagements de l'utilisateur</h3>
          <p>
            Vous vous engagez à fournir des informations exactes et à maintenir la confidentialité de vos identifiants.
          </p>

          <h3 className="text-xl font-bold">4. Responsabilités</h3>
          <p>
            Les investissements comportent des risques. Silvo Finance ne garantit pas les rendements et décline toute responsabilité en cas de perte.
          </p>

          <h3 className="text-xl font-bold">5. Modification des conditions</h3>
          <p>
            Silvo Finance se réserve le droit de modifier ces conditions à tout moment. Les modifications seront notifiées par email.
          </p>
        </div>
      )
    },
    privacy: {
      title: "Politique de Confidentialité",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">1. Collecte des informations</h3>
          <p>
            Nous collectons les informations nécessaires à la création de votre compte et à la fourniture de nos services.
          </p>

          <h3 className="text-xl font-bold">2. Utilisation des données</h3>
          <p>
            Vos données sont utilisées pour personnaliser votre expérience, améliorer nos services et assurer la sécurité.
          </p>

          <h3 className="text-xl font-bold">3. Protection des données</h3>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données.
          </p>

          <h3 className="text-xl font-bold">4. Partage des informations</h3>
          <p>
            Vos données ne seront jamais vendues. Elles peuvent être partagées avec nos partenaires techniques dans le strict cadre de la fourniture du service.
          </p>

          <h3 className="text-xl font-bold">5. Vos droits</h3>
          <p>
            Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.
          </p>
        </div>
      )
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-300 z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {content[type].title}
          </h2>
          
          <div className="prose prose-sm sm:prose max-w-none text-gray-700">
            {content[type].content}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;