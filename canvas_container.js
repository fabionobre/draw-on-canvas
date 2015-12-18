function CanvasDigital(div_id, src, cores) {
	
	var canvas_object = this;
	canvas_object.contexto = null;
	canvas_object.canvas = null;
	canvas_object.digital = new Image();
	canvas_object.digital.src = src;
	canvas_object.div_id = div_id;
	canvas_object.mouse = {}
	canvas_object.mouse_start = {}
	canvas_object.cores = cores;
	canvas_object.marcacoes_digital_referencia = [];	
	canvas_object.selecionado = null;
	canvas_object.rotacao = 0;

	this.inicia_canvas = function(div_id, src) {

    canvas_object.canvas = document.getElementById(canvas_object.div_id);
    canvas_object.contexto = canvas_object.canvas.getContext("2d");
    canvas_object.contexto.drawImage(canvas_object.digital,0,0);

		canvas_object.canvas.addEventListener('mousemove', function(e) {

	  	canvas_object.mouse.x = e.pageX - canvas_object.canvas.offsetLeft;
	  	canvas_object.mouse.y = e.pageY - canvas_object.canvas.offsetTop;

			if (canvas_object.acao == "mover" || canvas_object.acao == "escalar") {

				var ponto_inicio = {x: canvas_object.mouse_start.x, y: canvas_object.mouse_start.y};
				var ponto_click = {x: canvas_object.mouse.x, y: canvas_object.mouse.y};

				var offset_x = ponto_inicio.x - ponto_click.x;
				var offset_y = ponto_inicio.y - ponto_click.y;

			    if (canvas_object.acao == "mover") {
				
			    	canvas_object.selecionado.x = canvas_object.selecionado.x - offset_x;
			    	canvas_object.selecionado.y = canvas_object.selecionado.y - offset_y;
			    
			    } else if (canvas_object.acao == "escalar") {

					canvas_object.selecionado.escalar(canvas_object.acao_tipo, canvas_object.mouse.x, canvas_object.mouse.y);
			    } 

			    canvas_object.redraw();
			}

			canvas_object.mouse_start.x = canvas_object.mouse.x
			canvas_object.mouse_start.y = canvas_object.mouse.y

		}, false);

		canvas_object.canvas.addEventListener('mousedown', function(e) {

			canvas_object.acao = "criar";

			// marcador já selecionado
			if (canvas_object.selecionado != null) {
				
				canvas_object.acao_tipo = canvas_object.selecionado.click_seleciona_modificador(canvas_object.mouse.x, canvas_object.mouse.y)
				
				if (canvas_object.selecionado.click_seleciona_marcador(canvas_object.mouse.x, canvas_object.mouse.y)) {
					
					canvas_object.acao = "mover";

				} else if (canvas_object.acao_tipo != null) {

					canvas_object.acao_tipo = canvas_object.selecionado.click_seleciona_modificador(canvas_object.mouse.x, canvas_object.mouse.y);
					canvas_object.acao = "escalar";
				}
			} else {

				// clique sobre um marcador, o sistema irá selecionar o marcador para alteração
				for (key in canvas_object.marcacoes_digital_referencia) {
					if (canvas_object.marcacoes_digital_referencia[key].click_seleciona_marcador(canvas_object.mouse.x, canvas_object.mouse.y)) {
						
						canvas_object.acao = "selecionar";
						canvas_object.selecionado = canvas_object.marcacoes_digital_referencia[key];
						canvas_object.redraw();
					}
				}
			}

			canvas_object.mouse_start.x = canvas_object.mouse.x
			canvas_object.mouse_start.y = canvas_object.mouse.y

		}, false);		
	
		canvas_object.canvas.addEventListener('mouseup', function() {

		    if (canvas_object.acao == "criar") {

		    	if (canvas_object.selecionado != null) {

					canvas_object.selecionado = null;
					canvas_object.redraw();

		    	} else {

   					canvas_object.novo_marcador(canvas_object.mouse.x, canvas_object.mouse.y);
   				}
		    } 

		    canvas_object.acao = "none";

		}, false);

    	$('#' + canvas_object.div_id).parent().find('marcador').each(function() {

			marcador = {x: parseInt($(this).attr('pontox')), y: parseInt($(this).attr('pontoy')), tamanho_x: parseInt($(this).attr('tamanhox')), tamanho_y: parseInt($(this).attr('tamanhoy'))};
			canvas_object.adiciona_marcador(marcador);
		});
	}

	canvas_object.novo_marcador = function(posicao_click_x, posicao_click_y) {
	
		if (canvas_object.marcacoes_digital_referencia.length >= 10) {
			alert("Número máximo (10) de marcações alcançado");
			return;
		}

		var marcador = new Marcador(posicao_click_x, posicao_click_y);
		marcador.id = canvas_object.marcacoes_digital_referencia.length

		canvas_object.marcacoes_digital_referencia.push(marcador);
		canvas_object.redraw();
	}	

	canvas_object.adiciona_marcador = function(marcador) {

		if (canvas_object.marcacoes_digital_referencia.length >= 10) {
			alert("Número máximo (10) de marcações alcançado");
			return;
		}

		var marcador_novo = new Marcador(marcador.x, marcador.y);
		marcador_novo.id = canvas_object.marcacoes_digital_referencia.length
		marcador_novo.tamanho_x = marcador.tamanho_x
		marcador_novo.tamanho_y = marcador.tamanho_y

		canvas_object.marcacoes_digital_referencia.push(marcador_novo);
		canvas_object.redraw();
	}

	canvas_object.desenha_marcador = function(marcador) {

	  canvas_object.contexto.beginPath();

		canvas_object.contexto.ellipse(marcador.x, marcador.y, marcador.tamanho_x, marcador.tamanho_y, 0, 0, Math.PI*2);
		// canvas_object.contexto.arc(marcador.x, marcador.y, marcador.tamanho_x, 0, 2 * Math.PI, false);
		canvas_object.contexto.lineWidth = 3;
		canvas_object.contexto.strokeStyle = canvas_object.cores.recupera_por_indice(marcador.id);
		canvas_object.contexto.stroke();

		if (canvas_object.selecionado == marcador) {

			canvas_object.contexto.beginPath();
			
			canvas_object.contexto.rect(marcador.x - marcador.tamanho_x - 10, marcador.y - marcador.tamanho_y - 10, 10, 10);
			canvas_object.contexto.rect(marcador.x + marcador.tamanho_x, marcador.y - marcador.tamanho_y - 10, 10, 10);
			canvas_object.contexto.rect(marcador.x - marcador.tamanho_x - 10, marcador.y + marcador.tamanho_y, 10, 10);
			canvas_object.contexto.rect(marcador.x + marcador.tamanho_x, marcador.y + marcador.tamanho_y, 10, 10);

			canvas_object.contexto.fillStyle = '#EEEEEE';
			canvas_object.contexto.fill();
			canvas_object.contexto.lineWidth = 1;
			canvas_object.contexto.strokeStyle = '#333333';
			canvas_object.contexto.stroke();
		}
	}

	canvas_object.desenha_marcadores = function() {

		for(key in canvas_object.marcacoes_digital_referencia) {
			canvas_object.desenha_marcador(canvas_object.marcacoes_digital_referencia[key]);
		}
	}

	canvas_object.redraw = function() {
	
		canvas_object.contexto.clearRect(0, 0, canvas_object.canvas.width, canvas_object.canvas.height);
		canvas_object.contexto.drawImage(canvas_object.digital,0,0);
		canvas_object.desenha_marcadores();
		canvas_object.exibe_botao_excluir();
	}

	canvas_object.seleciona_marcador = function(id) {

		for (key in canvas_object.marcacoes_digital_referencia) {

			if (key == id) {
				canvas_object.selecionado = canvas_object.marcacoes_digital_referencia[key];
			} else {
			}
		}
	}

	canvas_object.associa_botao_excluir = function(id) {

		var contexto = this;
		this.div_excluir = $("#" + id);

		this.div_excluir.click(function() {
			contexto.excluir();
		}); 

		this.exibe_botao_excluir();
	}

	canvas_object.excluir = function() {

		canvas_object.marcacoes_digital_referencia.splice(canvas_object.selecionado.id, 1);
		canvas_object.selecionado = null;

		for (key in canvas_object.marcacoes_digital_referencia) {
			canvas_object.marcacoes_digital_referencia[key].id = key;
		}

		canvas_object.redraw();
	}

	canvas_object.exibe_botao_excluir = function() {

		if (canvas_object.div_excluir == null) {
			return;
		}

		if (canvas_object.selecionado == null) {
			$(canvas_object.div_excluir).hide();
		} else {
			$(canvas_object.div_excluir).show();
		}
	}

	canvas_object.recupera_marcacoes = function() {
		console.log(canvas_object.marcacoes_digital_referencia);
	}  	

	canvas_object.digital.onload = function() {

		$('#' + canvas_object.div_id).attr('width', canvas_object.digital.width);
		$('#' + canvas_object.div_id).attr('height', canvas_object.digital.height);

		canvas_object.width = canvas_object.digital.width;
		canvas_object.height = canvas_object.digital.height;

		canvas_object.inicia_canvas();
	}
}