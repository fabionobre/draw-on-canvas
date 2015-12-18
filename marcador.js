function Marcador(posicao_click_x, posicao_click_y) {

	var marcador = this;
	marcador.id = 0;
	marcador.tamanho_x = 10;
	marcador.tamanho_y = 10;
	marcador.x = posicao_click_x;
	marcador.y = posicao_click_y;
	marcador.contexto = null;
	
	this.click_seleciona_marcador = function(ponto_x, ponto_y) {


		pontos_marcador = [
		    {x: marcador.x - marcador.tamanho_x, y: marcador.y - marcador.tamanho_y},
		    {x: marcador.x + marcador.tamanho_x, y: marcador.y - marcador.tamanho_y},
		    {x: marcador.x + marcador.tamanho_x, y: marcador.y + marcador.tamanho_y},
		    {x: marcador.x - marcador.tamanho_x, y: marcador.y + marcador.tamanho_y},
			{x: marcador.x - marcador.tamanho_x, y: marcador.y - marcador.tamanho_y}
		];

		ponto_click = {x: ponto_x, y: ponto_y}

		return ponto_dentro_poligono(pontos_marcador, ponto_click);
	}

	this.click_seleciona_modificador = function(ponto_x, ponto_y) {

		ponto_click = {x: ponto_x, y: ponto_y}
		
		pontos_se = pontos_retangulo(marcador.x - marcador.tamanho_x - 10, marcador.y - marcador.tamanho_y - 10, 10);
		pontos_sd = pontos_retangulo(marcador.x + marcador.tamanho_x, marcador.y - marcador.tamanho_y - 10, 10);
		pontos_id = pontos_retangulo(marcador.x + marcador.tamanho_x, marcador.y + marcador.tamanho_y, 10);
		pontos_ie = pontos_retangulo(marcador.x - marcador.tamanho_x - 10, marcador.y + marcador.tamanho_y, 10);

		if (ponto_dentro_poligono(pontos_se, ponto_click)) {
			return "ponto_se"
		} else if (ponto_dentro_poligono(pontos_sd, ponto_click)) {
			return "ponto_sd"
		} else if (ponto_dentro_poligono(pontos_id, ponto_click)) {
			return "ponto_id"
		} else if (ponto_dentro_poligono(pontos_ie, ponto_click)) {
			return "ponto_ie"
		}
	}

	this.escalar = function(acao_tipo, ponto_x, ponto_y) {

		pontos_se = {x: marcador.x - marcador.tamanho_x, y: marcador.y - marcador.tamanho_y};
		pontos_sd = {x: marcador.x + marcador.tamanho_x, y: marcador.y - marcador.tamanho_y};
		pontos_id = {x: marcador.x + marcador.tamanho_x, y: marcador.y + marcador.tamanho_y};
		pontos_ie = {x: marcador.x - marcador.tamanho_x, y: marcador.y + marcador.tamanho_y};

		if (acao_tipo == 'ponto_se') {

			marcador.tamanho_x = Math.round((pontos_id.x - ponto_x) / 2);
			marcador.x = (pontos_id.x - marcador.tamanho_x);
			marcador.tamanho_y = Math.round((pontos_id.y - ponto_y) / 2);
			marcador.y = (pontos_id.y - marcador.tamanho_y);

		} else if (acao_tipo == 'ponto_sd') {

			marcador.tamanho_x = Math.round((ponto_x - pontos_ie.x) / 2);
			marcador.x = (pontos_ie.x + marcador.tamanho_x);
			marcador.tamanho_y = Math.round((pontos_ie.y - ponto_y) / 2);
			marcador.y = (pontos_ie.y - marcador.tamanho_y);

		} else if (acao_tipo == 'ponto_id') {

			marcador.tamanho_x = Math.round((ponto_x - pontos_se.x) / 2);
			marcador.x = (pontos_se.x + marcador.tamanho_x);
			marcador.tamanho_y = Math.round((ponto_y - pontos_se.y) / 2);
			marcador.y = (pontos_se.y + marcador.tamanho_y);

		} else if (acao_tipo == 'ponto_ie') {

			marcador.tamanho_x = Math.round((pontos_sd.x - ponto_x) / 2);
			marcador.x = (pontos_sd.x - marcador.tamanho_x);
			marcador.tamanho_y = Math.round((ponto_y - pontos_sd.y) / 2);
			marcador.y = (pontos_sd.y + marcador.tamanho_y);
		}

		if (marcador.tamanho_x < 0) {
			marcador.tamanho_x = 1;
		}

		if (marcador.tamanho_y < 0) {
			marcador.tamanho_y = 1;	
		}
	}

	function pontos_retangulo(ponto_x, ponto_y, tamanho) {

		var ponto_max_x = ponto_x;
		var ponto_max_y = ponto_y;

		var pontos = [
		    {x: ponto_max_x, y: ponto_max_y},
		    {x: ponto_max_x + tamanho, y: ponto_max_y},
		    {x: ponto_max_x + tamanho, y: ponto_max_y + tamanho},
		    {x: ponto_max_x - tamanho, y: ponto_max_y + tamanho},
			{x: ponto_max_x, y: ponto_max_y}
		];

		return pontos;
	}

	// funcao aproveitada do site
	// http://jsfromhell.com/pt/math/is-point-in-poly
	function ponto_dentro_poligono(poly, pt) {

	    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
	        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
	        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
	        && (c = !c);
	    return c;
	}
}