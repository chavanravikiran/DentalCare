package com.dentalcare.dentalcaremanager.exception;

/**
 * Exception levée lorsqu'un rendez-vous est introuvable en base de données
 */
public class RendezVousNotFoundException extends RuntimeException {
  public RendezVousNotFoundException(Integer id) {
    super("Aucun rendez-vous trouvé avec l'ID : " + id);
  }
}
