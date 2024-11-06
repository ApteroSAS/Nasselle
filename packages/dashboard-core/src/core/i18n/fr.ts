import type {TranslationMessages} from 'react-admin';
import frenchMessages from 'ra-language-french';

const customFrenchMessages: TranslationMessages = {
    ...frenchMessages,
    pos: {
        search: 'Rechercher',
        configuration: 'Configuration',
        language: 'Langue',
        theme: {
            name: 'Theme',
            light: 'Clair',
            dark: 'Obscur',
        },
        dashboard: {
            monthly_revenue: 'CA à 30 jours',
            month_history: "Chiffre d'affaire sur 30 jours",
            new_orders: 'Nouvelles commandes',
            pending_reviews: 'Commentaires à modérer',
            all_reviews: 'Voir tous les commentaires',
            new_customers: 'Nouveaux clients',
            all_customers: 'Voir tous les clients',
            pending_orders: 'Commandes à traiter',
            order: {
                items: 'par %{customer_name}, un poster |||| par %{customer_name}, %{nb_items} posters',
            },
            welcome: {
                title: 'Bienvenue sur la démo e-commerce de react-admin',
                subtitle:
                    "Ceci est le back-office d'un magasin de posters imaginaire. N'hésitez pas à explorer et à modifier les données. La démo s'exécute en local dans votre navigateur, et se remet à zéro chaque fois que vous rechargez la page.",
                ra_button: 'Site web de react-admin',
                demo_button: 'Code source de cette démo',
            },
        },
        menu: {
            sales: 'Ventes',
            catalog: 'Catalogue',
            customers: 'Clients',
        },
    },
    resources: {
        /** /!\ do not remove or edit this field /!\ This will be filled dynamically by the config in the respective panes **/
    },
};

export default customFrenchMessages;
