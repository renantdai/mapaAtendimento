let map, infoWindow;
let marcadores = [];
let dados = [];
let displayMapa = false;
let directionsService;
let directionsRenderer;
var funcaoCriada = false;

$(document).ready(function () {
    var multipleCancelButton = new Choices('#choices-multiple-remove-button', {
        removeItemButton: true,
        maxItemCount: 25,
        searchResultLimit: 25,
        renderChoiceLimit: 25
    });
});

function recebeDadosBackEnd(dadosRecebido, displayMapaRecebido) {
    dados = dadosRecebido;
    displayMapa = displayMapaRecebido;
}

const initDrawing = (map) => {
    let drawingManager = new google.maps.drawing.DrawingManager({
        map: map,
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
        },
        //Cores para cada opção
        circleOptions: {
            fillColor: '#f00',
            editable: true, //permite editar
            dragabble: true //permite arrastar
        }
    });

    google.maps.event.addListener(drawingManager, 'circlecomplete', (circle) => {
        // desenhar circulo - Raio, centro
        const center = circle.getCenter();
        const radius = circle.getRadius();

        const obj = {
            center: center,
            radius: radius
        };

        localStorage.setItem('circleData', JSON.stringify(obj));
        console.log('completed circle', circle);
        // polygon.setEditable(true); // permitir editar
    });

    //evento geral para as ferramentas
    google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
        console.log(event);
        // polygon.setEditable(true); // permitir editar
    });
}

function showShapes(map) {
    const circleData = localStorage.circleData;
    if (circleData) {
        const obj = JSON.parse(circleData);
        new google.maps.Circle({
            map,
            radius: obj.radius,
            center: obj.center
        });
        localStorage.clear();
    }
}

function initMap() {
    // Map options
    var options = {
        zoom: 12,
        center: {
            lat: -29.915580,
            lng: -50.101535
        }
    }

    if (displayMapa) {
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer({
            draggable: true
        });

        // New map
        map = new google.maps.Map(document.getElementById('map'), options);

        //desenharRota();

        infoWindow = new google.maps.InfoWindow();

        const locationButton = document.createElement("button");

        locationButton.textContent = "Minha Localização";
        locationButton.classList.add("btn");
        locationButton.classList.add("btn-info");
        locationButton.classList.add("btn-sm");
        locationButton.style.marginTop = '10px';
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
        locationButton.addEventListener("click", () => {
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const posicaoAtual = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };

                        infoWindow.setPosition(posicaoAtual);
                        infoWindow.setContent("Localização Encontrada");
                        infoWindow.open(map);
                        map.setCenter(posicaoAtual);
                        minhaLocalizacao = {
                            content: 'Minha localização',
                            coords: posicaoAtual,
                            iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',

                        };
                        addMarker(minhaLocalizacao, 'Caminhão');
                    },
                    () => {
                        handleLocationError(true, infoWindow, map.getCenter());
                    }
                );
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter());
            }
        });

        for (var i = 0; i < dados.length; i++) {
            //botao do editar modal dentro do marcador
            const chamaModal = 'Criado: ' + dados[i].dataCriacao + '<div class="container-fluid"><div class="row"><a class="btn btn-success edit-btn" href="https://www.google.com/maps/search/?api=1&query=' + dados[i].lat + '%2C' + dados[i].lon + '" target="_blank">GPS<ion-icon name="navigate-outline"></ion-icon></a><br></div>' + '<div class="row"><label></label><button type="button" name="alterarStatus" class="btn btn-warning alterarStatus"  id="' + dados[i].titulo + '">ATENDIMENTO</button></div><div class="row"><label></label><button type="button" class="btn btn-danger verImagem"  id="' + dados[i].titulo + '">IMAGEM</button></div>';
            const informacaoAtendimento = '<div id="passar_mouse">Informações de Atendimento <div id="mostrar">' + dados[i].observacao + '</div></div>';
            //VERIFICA SE OS PONTOS SÃO DA ILUMINACAO
            if (dados[i].finalidade == "iluminacao" || dados[i].finalidade == '' || dados[i].finalidade == null) {
                if (dados[i].solicitante) {

                    markers = [{
                        content: chamaModal + informacaoAtendimento,
                        coords: {
                            lat: parseFloat(dados[i].lat),
                            lng: parseFloat(dados[i].lon)
                        },
                        iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png',

                    }];
                } else if (dados[i].frequencia == "duplicado") {
                    markers = [{
                        content: chamaModal,
                        coords: {
                            lat: parseFloat(dados[i].lat),
                            lng: parseFloat(dados[i].lon)
                        },
                        iconImage: 'https://iluminacao.imbe.rs.gov.br/img/marcadores/marcador-laranja.svg',

                    }];

                } else if (dados[i].frequencia == "triplicado") {
                    markers = [{
                        content: chamaModal,
                        coords: {
                            lat: parseFloat(dados[i].lat),
                            lng: parseFloat(dados[i].lon)
                        },
                        iconImage: 'https://iluminacao.imbe.rs.gov.br/img/marcadores/marcador-vermelho.svg',

                    }];
                } else {
                    markers = [{

                        content: chamaModal,
                        coords: {
                            lat: parseFloat(dados[i].lat),
                            lng: parseFloat(dados[i].lon)
                        },
                        iconImage: 'https://iluminacao.imbe.rs.gov.br/img/marcadores/marcador-verde.svg',
                    }];
                }

            } else {
                //PONTOS DO MEIO AMBIENTE
                if (dados[i].frequencia == "duplicado") {
                    markers = [{
                        content: dados[i].titulo,
                        coords: {
                            lat: parseFloat(dados[i].lat),
                            lng: parseFloat(dados[i].lon)
                        },
                        iconImage: 'http://iluminacao.imbe.rs.gov.br/img/marcadores/meioambiente-laranja.png',
                        animation: google.maps.Animation.DROP
                    }];

                } else if (dados[i].frequencia == "triplicado") {
                    markers = [{
                        content: dados[i].titulo,
                        coords: {
                            lat: parseFloat(dados[i].lat),
                            lng: parseFloat(dados[i].lon)
                        },
                        iconImage: 'http://iluminacao.imbe.rs.gov.br/img/marcadores/meioambiente-vermelho.png',
                        animation: google.maps.Animation.DROP
                    }];
                } else {
                    markers = [{

                        content: dados[i].titulo,
                        coords: {
                            lat: parseFloat(dados[i].lat),
                            lng: parseFloat(dados[i].lon)
                        },
                        iconImage: 'http://iluminacao.imbe.rs.gov.br/img/marcadores/meioambiente-verde.png',

                    }];
                }
            }
            addMarker(markers[0], dados[i].titulo);
        }

        //initDrawing(map); //inicia ferramenta de desenho
        //showShapes(map); // recupera desenhos
    }
    // Add Marker Function
    //propriedades do ponto
    function addMarker(props, index) {
        const marker = new google.maps.Marker({
            label: index,
            position: props.coords,
            map: map,
            icon: props.iconImage,
            content: props.content,
            optimized: true
        });
        // Check for customicon
        if (props.iconImage) {
            // Set icon image
            marker.setIcon(props.iconImage);

        }
        marcadores.push(marker);
        // Check content
        if (props.content) {
            var infoWindow = new google.maps.InfoWindow({
                content: props.content
            });

            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            });
        }
    }

    preencherSelecaoRota();
}

function desenharRota() {
    directionsRenderer.setMap(map); // renderizar mapa para gps
    directionsRenderer.addListener('directions_canged', () => {
        console.log(directionsRenderer);
    });

    directionsService.route({
        origin: 'Tramandaí, Brasil',
        destination: 'Capão da Canoa, Brasil',
        waypoints: [
            {
                location: 'Imbé, Brasil', stopover: true
            }
        ],
        travelMode: google.maps.TravelMode.DRIVING
    }).then(response => {
        console.log({ response });
        map.fitBounds(response.routes[0].bounds);
        renderPolyline(response.routes[0].overview_path, map);
        // directionsRenderer.setDirections(response);
    }).catch(err => {
        console.log({ err });
    });
}

function renderPolyline(path, map) {
    new google.maps.Polyline({
        path: path,
        map: map
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarker(labels) {
    labels.map(label => {
        let recebeMarcador = marcadores.find(marcador => marcador.label == label);
        if (recebeMarcador) {
            recebeMarcador.setMap(null);
        }
    }
    );
    /*     let recebeMarcador = marcadores.find(marcador => marcador.label == labels);
        if (recebeMarcador) {
            recebeMarcador.setMap(null);
        } */
}
// add event listeners for the buttons - Criar para filtragem do mapa
/*     document
    .getElementById("show-markers")
    .addEventListener("click", showMarkers);
document
    .getElementById("hide-markers")
    .addEventListener("click", hideMarkers);
document
    .getElementById("delete-markers")
    .addEventListener("click", deleteMarkers); */

//MODAL PARA STATUS DOS PONTOS
$(document).on('click', '.alterarStatus', function () {
    carregaModalAtendimento();
    /*  var idEndereco = $(this).attr("id"); */
    // Pega o Id do Ponto para procurar no BD (O id fica gravado no Banco)
    var ponto_id = $(this).attr("id");
    relacaoAtendimento = '';
    idAtendidos = '';
    listaAtendidos = '';
    if (ponto_id !== '') {
        var dados = {
            ponto_id: ponto_id
        };
        $.get('/ponto/atendidos?idPonto=' + parseInt(ponto_id), function (retorno) {
            let elementos = ['created_at', 'updated_at', 'descricao', 'base', 'lampada', 'reator', 'rele', 'revisao', 'usuario'];
            if (retorno) {
                var chamadosAtendidos = JSON.parse(retorno);
                for (var i = 0; i < chamadosAtendidos.length; i++) {
                    relacaoAtendimentoAtendidos = '';
                    idAtendidos += '<li class="nav-item"><a class="nav-link" id="atendimento' + chamadosAtendidos[i].id + '-tab" data-toggle="tab" href="#atendimento' + chamadosAtendidos[i].id + '" role="tab" aria-controls="' + chamadosAtendidos[i].id + '" aria-selected="true">Nº: ' + chamadosAtendidos[i].id + '</a></li>';
                    elementos.forEach(key => {
                        valida = (chamadosAtendidos[i][key] != 'nao' && chamadosAtendidos[i][key] != '' && !(chamadosAtendidos[i][key] == 'null') && !(chamadosAtendidos[i][key] == null));
                        if (valida) {
                            relacaoAtendimentoAtendidos += '<li class="list-group-item d-flex justify-content-between align-items-center">' + key +
                                '<span class="badge bg-primary rounded-pill">' + chamadosAtendidos[i][key] + '</span></li>';
                        }
                    });
                    listaAtendidos += '<div class="tab-pane fade" id="atendimento' + chamadosAtendidos[i].id + '" role="tabpanel" aria-labelledby="' + chamadosAtendidos[i].id + '-tab">' + relacaoAtendimentoAtendidos + '</div>';
                }
                $("#myTab").html(idAtendidos);
                $("#myTabContent").html(listaAtendidos);
            }
        });
        //Carregar o conteúdo para o usuário
        $("#PontoSelecionado").val(ponto_id);
        $("#idPonto").html(ponto_id);
        $('#modalPonto').modal('show');
        const formAtendimentoAtualizar = document.querySelector('#form-atendimento-atualizar');
        formAtendimentoAtualizar.reset(); //limpa os input selecionados.
    }
});

//MODAL PARA VER IMAGEM
$(document).on('click', '.verImagem', function () {
    // Pega o Id do Ponto para procurar no BD (O id fica gravado no Banco)
    var ponto_id = $(this).attr("id");

    if (ponto_id !== '') {
        var dados = {
            ponto_id: ponto_id
        };
        $.get('../../ponto/imagens/localizar/' + ponto_id, dados, function (retorna) {
            var urlImagem = '';
            if (!retorna) {
                //não localizado - Regra não está funcionando
                urlImagem = 'https://prints.ultracoloringpages.com/5981a83ad9b7c6dbac61b1dbb8337eb3.png';
                $("#label-imagem").html('Não encontrado');
            } else {
                retorna.map(function (imagem) {
                    urlImagem = (imagem.fotoPoste);
                });
                //Carregar o conteúdo para o usuário
                $("#imagem").attr('src', urlImagem);
                $("#label-imagem").html('Busca de imagem');
            }
            $('#modalImagem').modal('show');
        });
    }
});

function carregaModalAtendimento() {
    let data;
    let formE1 = document.getElementById('form-atendimento-atualizar');
    if (funcaoCriada == false) {
        formE1.addEventListener('submit', evento => {
            evento.preventDefault();
            let formData = new FormData(formE1);
            data = Object.fromEntries(formData);
            let arrayItens = [];
            let itens = document.querySelectorAll("#opcaoRevisao [type=checkbox]:checked"); //recebe os input da seleção
            for (let item of itens) arrayItens.push(item.value);
            data.revisao = arrayItens;
            atualizarPontoAPI(data);
            funcaoCriada = true;
        });
    }
}

function atualizarPontoAPI(data) {
    fetch('/atualizar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                return new Error('falhou a requisição') // cairá no catch da promise
            }

            if (response.status != 200 && response.status != 201) {
                return new Error('não encontrou qualquer resultado');
            }
            return response.json()
        }) //converte para json
        .then(data => {
            deleteMarker(data.id);
            //$("#modalPonto").toggle('hide'); efeito de ir para lateral
            $("#modalPonto").modal('hide');
        }) // recebe os dados do response
        .catch(err => console.log(err));
};

function preencherSelecaoRota() {
    marcadores.forEach(function (item) {
        $('#choices-multiple-remove-button-rota').append('<option value = ' + item.position.lat() + ',' + item.position.lng() + '>' + item.label + '</option>');
    });

    var multipleCancelButton2 = new Choices('#choices-multiple-remove-button-rota', {
        removeItemButton: true,
        maxItemCount: 10,
        searchResultLimit: 25,
        renderChoiceLimit: 25
    });
}

function montarRota() {
    var select = document.getElementById('choices-multiple-remove-button-rota');
    var items = [];
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].selected) {
            items.push(select.options[i].value);
        }
    }
    console.log(items.join('/'));
    let href = 'https://www.google.com.br/maps/dir//' + items.join('/');
    window.open(href, '_blank');
}
