"""
Supprime tous les produits existants de la base de données,
sans réinsérer de nouvelles données.
Utile si tu veux vider la table avant de lancer seed.py séparément,
ou pour repartir d'une base propre.
"""
from database import SessionLocal, engine
import model

model.Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    deleted_count = db.query(model.Product).delete(synchronize_session=False)
    db.commit()
    print(f"Supprimé {deleted_count} ancien(s) produit(s) de la base.")