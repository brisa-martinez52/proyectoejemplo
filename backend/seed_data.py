import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_database():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Seed Veterinarios
    veterinarios_existentes = await db.veterinarios.count_documents({})
    if veterinarios_existentes == 0:
        veterinarios = [
            {
                "id": "vet-1",
                "nombre": "María",
                "apellido": "González",
                "especialidad": "Medicina General",
                "telefono": "2991111111",
                "created_at": "2024-01-01T00:00:00+00:00"
            },
            {
                "id": "vet-2",
                "nombre": "Carlos",
                "apellido": "Rodríguez",
                "especialidad": "Cirugía",
                "telefono": "2992222222",
                "created_at": "2024-01-01T00:00:00+00:00"
            },
            {
                "id": "vet-3",
                "nombre": "Ana",
                "apellido": "Martínez",
                "especialidad": "Dermatología",
                "telefono": "2993333333",
                "created_at": "2024-01-01T00:00:00+00:00"
            }
        ]
        await db.veterinarios.insert_many(veterinarios)
        print(f"✅ Insertados {len(veterinarios)} veterinarios")
    
    # Seed Productos
    productos_existentes = await db.productos.count_documents({})
    if productos_existentes == 0:
        productos = [
            {
                "id": "prod-1",
                "nombre": "Alimento Perro Adulto",
                "descripcion": "Alimento balanceado premium para perros adultos 15kg",
                "precio": 25000.0,
                "stock": 50,
                "categoria": "Alimentos",
                "imagen_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
                "created_at": "2024-01-01T00:00:00+00:00"
            },
            {
                "id": "prod-2",
                "nombre": "Alimento Gato Adulto",
                "descripcion": "Alimento balanceado premium para gatos adultos 10kg",
                "precio": 18000.0,
                "stock": 40,
                "categoria": "Alimentos",
                "imagen_url": "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=400",
                "created_at": "2024-01-01T00:00:00+00:00"
            },
            {
                "id": "prod-3",
                "nombre": "Collar Antipulgas",
                "descripcion": "Collar antipulgas y garrapatas de larga duración",
                "precio": 5000.0,
                "stock": 100,
                "categoria": "Accesorios",
                "imagen_url": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400",
                "created_at": "2024-01-01T00:00:00+00:00"
            },
            {
                "id": "prod-4",
                "nombre": "Juguete Interactivo",
                "descripcion": "Juguete interactivo para mascotas con dispensador de premios",
                "precio": 3500.0,
                "stock": 75,
                "categoria": "Juguetes",
                "imagen_url": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
                "created_at": "2024-01-01T00:00:00+00:00"
            },
            {
                "id": "prod-5",
                "nombre": "Cama Ortopédica",
                "descripcion": "Cama ortopédica con memoria para mascotas grandes",
                "precio": 12000.0,
                "stock": 30,
                "categoria": "Accesorios",
                "imagen_url": "https://images.unsplash.com/photo-1615789591457-74a63395c990?w=400",
                "created_at": "2024-01-01T00:00:00+00:00"
            },
            {
                "id": "prod-6",
                "nombre": "Shampoo Medicado",
                "descripcion": "Shampoo medicado para piel sensible 500ml",
                "precio": 2500.0,
                "stock": 60,
                "categoria": "Higiene",
                "imagen_url": "https://images.unsplash.com/photo-1608923947560-79f7e6c43b9f?w=400",
                "created_at": "2024-01-01T00:00:00+00:00"
            }
        ]
        await db.productos.insert_many(productos)
        print(f"✅ Insertados {len(productos)} productos")
    
    print("✅ Base de datos inicializada correctamente")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
