function Cores() {

	var cores = this;
	cores.cores = ['#FF0000', '#FF9900', '#9933CC', '#0000FF', '#FFFF00', '#33CC00', '#00CCCC', '#0066CC', '#00FF00', '#00FFFF']
	cores.cores_disponiveis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

	this.existe_cor_disponivel = function() {
		
		return cores.cores_disponiveis.length > 0;
	}

	this.recupera_proxima_cor = function() {

		if (cores.cores_disponiveis.length > 0) {
			var cor = cores.cores[cores.cores_disponiveis[0]];
			cores.cores_disponiveis.splice(0, 1);

			return cor;
		}
	}

	this.recupera_por_indice = function(id) {

		return cores.cores[id];
	}	
}