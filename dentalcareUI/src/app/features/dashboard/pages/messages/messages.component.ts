import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';

interface Message {
  id: number;
  sender: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  selectedMessage: Message | null = null;

  messages: Message[] = [
    {
      id: 1,
      sender: 'Khadija B.',
      subject: 'Douleurs après traitement',
      content: 'Bonjour docteur, j’ai encore des douleurs après la séance d’hier. Dois-je prendre autre chose en plus du Paracétamol ?',
      date: '31 mai 2025, 10:14',
      read: false
    },
    {
      id: 2,
      sender: 'Mohamed E.',
      subject: 'Confirmation RDV',
      content: 'Merci pour la confirmation. Je serai présent à 14h. Cordialement.',
      date: '30 mai 2025, 18:02',
      read: true
    },
    {
      id: 3,
      sender: 'Salma R.',
      subject: 'Demande d\'urgence',
      content: 'Je souffre énormément depuis ce matin, y a-t-il une disponibilité rapide ?',
      date: '30 mai 2025, 08:47',
      read: false
    },
    {
      id: 4,
      sender: 'Youssef H.',
      subject: 'Remerciements',
      content: 'Merci pour votre professionnalisme, la douleur a complètement disparu. Je recommande vivement votre cabinet.',
      date: '29 mai 2025, 16:20',
      read: true
    },
    {
      id: 5,
      sender: 'Leila M.',
      subject: 'Facture manquante',
      content: 'Bonjour, je n’ai pas reçu la facture de ma consultation du 28 mai. Pouvez-vous me l’envoyer ?',
      date: '29 mai 2025, 10:45',
      read: false
    },
    {
      id: 6,
      sender: 'Nour E.',
      subject: 'Changement de RDV',
      content: 'Je ne pourrai pas être là demain. Est-il possible de décaler le RDV au lundi 3 juin matin ?',
      date: '28 mai 2025, 09:33',
      read: true
    },
    {
      id: 7,
      sender: 'Rachid A.',
      subject: 'Problème avec le devis',
      content: 'Le devis envoyé comporte une erreur de montant. Pouvez-vous me confirmer s’il y a eu une mise à jour ?',
      date: '27 mai 2025, 14:12',
      read: false
    },
    {
      id: 8,
      sender: 'Sofia K.',
      subject: 'RDV pour blanchiment',
      content: 'Bonjour, je souhaite prendre un RDV pour un blanchiment dentaire la semaine prochaine.',
      date: '26 mai 2025, 17:48',
      read: true
    },
    {
      id: 9,
      sender: 'Omar L.',
      subject: 'Question sur l’assurance',
      content: 'Est-ce que vous acceptez les remboursements CNSS ? Je compte faire une dévitalisation.',
      date: '25 mai 2025, 13:27',
      read: true
    },
    {
      id: 10,
      sender: 'Nadia F.',
      subject: 'Préparation avant l’intervention',
      content: 'Faut-il être à jeun pour l’extraction prévue mardi ? Je préfère être bien préparée.',
      date: '24 mai 2025, 11:03',
      read: true
    },
    {
      id: 11,
      sender: 'Imane Z.',
      subject: 'Saignement après soin',
      content: 'J’ai un léger saignement après le détartrage. Est-ce normal ou dois-je consulter à nouveau ?',
      date: '24 mai 2025, 08:22',
      read: false
    },
    {
      id: 12,
      sender: 'Dr. Amine (Laboratoire)',
      subject: 'Résultats prothèse reçus',
      content: 'Les résultats de la prothèse pour le patient Ahmed R. sont prêts. Vous pouvez passer les récupérer quand vous voulez.',
      date: '23 mai 2025, 18:37',
      read: true
    }
  ];


  openMessage(msg: Message) {
    this.selectedMessage = msg;
    msg.read = true;
  }

  closeMessage() {
    this.selectedMessage = null;
  }
}
