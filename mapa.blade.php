@section('title','Mapa')
@include('layouts.cabecalho')
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="https://raw.githubusercontent.com/combatwombat/marker-animate/master/markerAnimate.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bbbootstrap/libraries@main/choices.min.css"><!-- Select multiple -->
<script src="https://cdn.jsdelivr.net/gh/bbbootstrap/libraries@main/choices.min.js"></script><!-- Select multiple -->
<script src="/js/mapa.js"></script>
<style>
    #map {
        height: 600px;
        width: 100%;
    }

    #mostrar {
        display: none;
    }

    #passar_mouse:hover #mostrar {
        display: block;
    }
</style>

<body>
    @include('layouts.header')
    <form action="/mapa/imbe" method="GET">
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-3">
                    <h6>Exibição: {{ $nomeArquivo }}</h6>
                </div>
                <div class="col-sm-5">
                    <select id="choices-multiple-remove-button" name='bairros[]' placeholder="Selecione o Bairro" multiple>
                        <option value="Albatroz">Albatroz</option>
                        <option value="Asa Branca">Asa Branca</option>
                        <option value="Centro">Centro</option>
                        <option value="Courhasa">Courhasa</option>
                        <option value="Harmonia">Harmonia</option>
                        <option value="Harmonia - Extensão B">Harmonia - Extensão B</option>
                        <option value="Imara">Imara</option>
                        <option value="Ipiranga">Ipiranga</option>
                        <option value="Mariluz">Mariluz</option>
                        <option value="Mariluz - Plano B">Mariluz - Plano B</option>
                        <option value="Mariluz - Plano C">Mariluz - Plano C</option>
                        <option value="Mariluz - Plano D">Mariluz - Plano D</option>
                        <option value="Mariluz Norte">Mariluz Norte</option>
                        <option value="Marisul">Marisul</option>
                        <option value="Morada do Sol">Morada do Sol</option>
                        <option value="Nordeste">Nordeste</option>
                        <option value="Nova Nordeste">Nova Nordeste</option>
                        <option value="Nova Santa Terezinha Norte">Nova Santa Terezinha Norte</option>
                        <option value="Presidente">Presidente</option>
                        <option value="Santa Terezinha">Santa Terezinha</option>
                        <option value="Santa Terezinha Norte">Santa Terezinha Norte</option>
                    </select>
                </div>
                <div class="col-sm-2">
                    <button type="submit" class="btn btn-info" style="text-align: left; margin-top: 5px">Pesquisar</button>
                </div>
                <div class="col-sm-1">
                    <a href='/mapa/imbe' class="btn btn-warning" style="margin-top: 5px">
                        Limpar
                    </a>
                </div>
            </div>
        </div>
    </form>

    <div class="container-fluid">
        <div id="map"></div>
        <div class="col-sm-5">
            <select id="choices-multiple-remove-button-rota" placeholder="Montar Rota" multiple>
            </select>
        </div>
        <div class="col-sm-2">
            <button type="button" class="btn btn-info" style="text-align: left; margin-top: 5px" onclick='montarRota()'>Gerar Rota</button>
        </div>
    </div>
    @include('layouts.footer')
</body>
<script>
    // recebe os dados do php
    var dadosRecebidos = <?php echo json_encode($gravarPontos); ?>;
    var displayMapaRecebidos = <?php echo json_encode($displayMapa); ?>;
    recebeDadosBackEnd(dadosRecebidos, displayMapaRecebidos);
</script>
<script>
    (g => {
        var h, a, k, p = "The Google Maps JavaScript API",
            c = "google",
            l = "importLibrary",
            q = "__ib__",
            m = document,
            b = window;
        b = b[c] || (b[c] = {});
        var d = b.maps || (b.maps = {}),
            r = new Set,
            e = new URLSearchParams,
            u = () => h || (h = new Promise(async (f, n) => {
                await (a = m.createElement("script"));
                e.set("libraries", [...r] + "");
                for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
                e.set("callback", c + ".maps." + q);
                a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                d[q] = f;
                a.onerror = () => h = n(Error(p + " could not load."));
                a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                m.head.append(a)
            }));
        d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
    })({
        key: "1234",
        // Add other bootstrap parameters as needed, using camel case.
        // Use the 'v' parameter to indicate the version to load (alpha, beta, weekly, etc.)
    });
</script>
<script async defer src="https://maps.googleapis.com/maps/api/js?key=1234&callback=initMap&libraries=drawing"></script>
<!-- Inclui o modal de Atendimento -->
@include('layouts.modals.atendimento')
@include('layouts.modals.imagem')
