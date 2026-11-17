# Mondovì · Cidade Aberta

RPG 2D de imersão em italiano pelas ruas de Mondovì. Abra `index.html` no navegador para jogar.

- WASD ou setas para andar e dirigir.
- E para conversar, embarcar ou interagir.
- V perto de um carro compartilhado para dirigir. Pressione V novamente para estacionar.
- M para abrir o mapa. Arraste, use a roda ou os botões + e −. Clique para marcar um destino.
- Use Missões para acompanhar etapas e atualizar a rota após cada conversa.

O jogo salva progresso neste navegador. A pronúncia usa as vozes de síntese de fala instaladas. Os exercícios C1 incluem mediação escrita e entrevista com áudio, transcrição opcional e autoavaliação. As cenas são fictícias.

## Desenvolvimento

- Execute `python build.py` para montar o HTML a partir de `src/`.
- Execute `node tests/city.cjs` para testar a lógica de navegação, missões, diálogos, veículos e salvamento.

## Mapa

Dados de © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), sob [ODbL](https://opendatacommons.org/licenses/odbl/1-0/). O recorte abrange Altipiano, Breo e Piazza. `src/city-data.json` contém os dados cartográficos processados usados pelo jogo.
