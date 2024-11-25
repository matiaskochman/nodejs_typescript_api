#!/bin/bash

BASE_URL="http://localhost:3000/api"

# Crear el Primer Post
echo "Creando el Primer Post..."
POST1=$(curl -s -X POST $BASE_URL/posts \
  -H "Content-Type: application/json" \
  -d '{
        "title": "Primer Post",
        "body": "Este es el contenido del primer post.",
        "userId": 1
      }')
echo "Respuesta: $POST1"
POST1_ID=$(echo $POST1 | jq -r '.id')

# Crear el Segundo Post
echo "Creando el Segundo Post..."
POST2=$(curl -s -X POST $BASE_URL/posts \
  -H "Content-Type: application/json" \
  -d '{
        "title": "Segundo Post",
        "body": "Este es el contenido del segundo post.",
        "userId": 2
      }')
echo "Respuesta: $POST2"
POST2_ID=$(echo $POST2 | jq -r '.id')

# Obtener Todos los Posts
echo "Obteniendo todos los posts..."
curl -s -X GET $BASE_URL/posts | jq
echo ""

# Añadir un Comentario al Primer Post
echo "Añadiendo un comentario al Primer Post..."
COMMENT1=$(curl -s -X POST $BASE_URL/comments \
  -H "Content-Type: application/json" \
  -d '{
        "body": "Este es un comentario para el primer post.",
        "name": "Ana García",
        "email": "ana.garcia@example.com",
        "postId": '$POST1_ID'
      }')
echo "Respuesta: $COMMENT1"
COMMENT1_ID=$(echo $COMMENT1 | jq -r '.id')

# Obtener Comentarios del Primer Post
echo "Obteniendo comentarios del Primer Post..."
curl -s -X GET $BASE_URL/posts/$POST1_ID/comments | jq
echo ""

# Mover el Comentario al Segundo Post
echo "Moviendo el Comentario al Segundo Post..."
curl -s -X PUT $BASE_URL/comments/move \
  -H "Content-Type: application/json" \
  -d '{
        "commentId": '$COMMENT1_ID',
        "newPostId": '$POST2_ID'
      }' | jq
echo ""

# Obtener Comentarios del Segundo Post
echo "Obteniendo comentarios del Segundo Post..."
curl -s -X GET $BASE_URL/posts/$POST2_ID/comments | jq
echo ""

# Soft Delete del Primer Post
echo "Eliminando lógicamente el Primer Post..."
curl -s -X DELETE $BASE_URL/posts/$POST1_ID | jq
echo ""

# Obtener Todos los Posts Después de la Eliminación
echo "Obteniendo todos los posts después de la eliminación..."
curl -s -X GET $BASE_URL/posts | jq
echo ""

# Restaurar el Primer Post
echo "Restaurando el Primer Post..."
curl -s -X PATCH $BASE_URL/posts/$POST1_ID/restore | jq
echo ""

# Obtener Todos los Posts Después de la Restauración
echo "Obteniendo todos los posts después de la restauración..."
curl -s -X GET $BASE_URL/posts | jq
echo ""
