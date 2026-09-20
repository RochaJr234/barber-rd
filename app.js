/* ==========================================================
   BARBER R.D
   APP.JS
   VERSÃO ESTÁVEL + FINANCEIRO
========================================================== */


/* ==========================================================
   CONFIGURAÇÕES
========================================================== */

const CHAVES = {
    agendamentos: "barberpro_agendamentos",
    clientes: "barberpro_clientes",
    servicos: "barberpro_servicos"
};


/* ==========================================================
   CONTROLE DO SISTEMA
========================================================== */

let telaAtual = "inicio";
let clienteFichaAtual = null;
let agendamentoAtual = null;

let dataAgendaSelecionada = dataHojeISO();

let mesAgendaAtual = new Date();
mesAgendaAtual.setDate(1);


/* ==========================================================
   LOCAL STORAGE
========================================================== */

function obterDados(chave) {

    try {

        const dados =
            localStorage.getItem(chave);

        if (!dados) {
            return [];
        }

        const resultado =
            JSON.parse(dados);

        if (!Array.isArray(resultado)) {
            return [];
        }

        return resultado;

    } catch (erro) {

        console.error(
            "Erro ao carregar dados:",
            chave,
            erro
        );

        return [];
    }
}


function salvarDados(chave, dados) {

    try {

        localStorage.setItem(
            chave,
            JSON.stringify(dados)
        );

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar dados:",
            chave,
            erro
        );

        mostrarMensagem(
            "Não foi possível salvar os dados."
        );

        return false;
    }
}


/* ==========================================================
   TESTE DO ARMAZENAMENTO
========================================================== */

function testarArmazenamento() {

    try {

        const chaveTeste =
            "__barberpro_teste__";

        localStorage.setItem(
            chaveTeste,
            "ok"
        );

        const resultado =
            localStorage.getItem(
                chaveTeste
            );

        localStorage.removeItem(
            chaveTeste
        );

        return resultado === "ok";

    } catch (erro) {

        console.error(
            "LocalStorage indisponível:",
            erro
        );

        return false;
    }
}


/* ==========================================================
   FUNÇÕES AUXILIARES
========================================================== */

function gerarId() {

    return (
        Date.now().toString() +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );
}


function dataHojeISO() {

    const hoje = new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


function formatarData(data) {

    if (!data) {
        return "—";
    }

    const partes =
        String(data).split("-");

    if (partes.length !== 3) {
        return data;
    }

    return (
        `${partes[2]}/` +
        `${partes[1]}/` +
        `${partes[0]}`
    );
}


function formatarDataLonga(data) {

    if (!data) {
        return "—";
    }

    const partes =
        String(data).split("-");

    if (partes.length !== 3) {
        return data;
    }

    const objeto =
        new Date(
            Number(partes[0]),
            Number(partes[1]) - 1,
            Number(partes[2])
        );

    return objeto.toLocaleDateString(
        "pt-BR",
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    );
}


function formatarMoeda(valor) {

    return Number(valor || 0)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
}


function gerarIniciais(nome) {

    if (!nome) {
        return "--";
    }

    const partes =
        String(nome)
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (partes.length === 1) {

        return partes[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        partes[0][0] +
        partes[partes.length - 1][0]
    ).toUpperCase();
}


function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function mostrarMensagem(texto) {

    const toast =
        document.getElementById("toast");

    if (!toast) {
        alert(texto);
        return;
    }

    toast.textContent = texto;

    toast.classList.add("mostrar");

    clearTimeout(
        window.barberRDToast
    );

    window.barberRDToast =
        setTimeout(() => {

            toast.classList.remove(
                "mostrar"
            );

        }, 2500);
}


/* ==========================================================
   TELAS
========================================================== */

const telas = {

    inicio:
        document.getElementById(
            "telaInicio"
        ),

    agenda:
        document.getElementById(
            "telaAgenda"
        ),

    novo:
        document.getElementById(
            "telaNovoAgendamento"
        ),

    detalhes:
        document.getElementById(
            "telaDetalhesAgendamento"
        ),

    clientes:
        document.getElementById(
            "telaClientes"
        ),

    novoCliente:
        document.getElementById(
            "telaNovoCliente"
        ),

    fichaCliente:
        document.getElementById(
            "telaFichaCliente"
        ),

    servicos:
        document.getElementById(
            "telaServicos"
        ),

    novoServico:
        document.getElementById(
            "telaNovoServico"
        ),

    financeiro:
        document.getElementById(
            "telaFinanceiro"
        ),

    relatorios:
        document.getElementById(
            "telaRelatorios"
        ),

    configuracoes:
        document.getElementById(
            "telaConfiguracoes"
        )

};

function mostrarTela(nome) {

    Object.keys(telas).forEach(
        chave => {

            if (telas[chave]) {

                telas[chave]
                    .classList
                    .remove("ativa");
            }
        }
    );

    if (telas[nome]) {

        telas[nome]
            .classList
            .add("ativa");

        telaAtual = nome;
    }

    atualizarNavegacao(nome);

    if (nome === "inicio") {
        atualizarDashboardHomeRD();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function atualizarNavegacao(nome) {

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove(
                "ativo"
            );

            const destino =
                item.dataset.tela;

            if (
                destino === nome ||

                (
                    destino === "agenda" &&
                    (
                        nome === "novo" ||
                        nome === "detalhes"
                    )
                ) ||

                (
                    destino === "clientes" &&
                    (
                        nome === "novoCliente" ||
                        nome === "fichaCliente"
                    )
                ) ||

                (
                    destino === "servicos" &&
                    nome === "novoServico"
                )
            ) {

                item.classList.add(
                    "ativo"
                );
            }
        });
}


/* ==========================================================
   SERVIÇOS PADRÃO
========================================================== */

function criarServicosPadrao() {

    const servicos =
        obterDados(
            CHAVES.servicos
        );

    if (servicos.length > 0) {
        return;
    }

    const padrao = [

        {
            id: gerarId(),
            nome: "Corte masculino",
            preco: 30,
            duracao: 30,
            ativo: true
        },

        {
            id: gerarId(),
            nome: "Barba",
            preco: 20,
            duracao: 20,
            ativo: true
        },

        {
            id: gerarId(),
            nome: "Corte + Barba",
            preco: 45,
            duracao: 50,
            ativo: true
        }

    ];

    salvarDados(
        CHAVES.servicos,
        padrao
    );
}


/* ==========================================================
   SERVIÇOS
========================================================== */

function renderizarServicos(filtroBusca = null) {

    const lista = document.getElementById("listaServicos");
    const vazio = document.getElementById("estadoVazioServicos");
    if (!lista) return;

    const servicos = obterDados(CHAVES.servicos);
    const buscaEl = document.getElementById("buscaServicos");
    const busca = filtroBusca !== null
        ? String(filtroBusca).trim().toLowerCase()
        : String(buscaEl?.value || "").trim().toLowerCase();

    const filtroAtual = document.querySelector("[data-filtro-servico].ativo")?.dataset.filtroServico || "todos";

    const ativos = servicos.filter(item => item.ativo !== false);
    const precoMedio = servicos.length
        ? servicos.reduce((s, item) => s + Number(item.preco || 0), 0) / servicos.length
        : 0;

    const total = document.getElementById("totalServicos");
    const totalAtivos = document.getElementById("servicosAtivos");
    if (total) total.textContent = servicos.length;
    if (totalAtivos) totalAtivos.textContent = ativos.length;

    // Indicador de preço médio, criado sem quebrar versões antigas do HTML.
    let media = document.getElementById("precoMedioServicos");
    if (!media) {
        const resumo = document.querySelector(".resumo-servicos");
        if (resumo) {
            resumo.insertAdjacentHTML("beforeend", `
                <div class="resumo-servico-item">
                    <span class="resumo-servico-icone">R$</span>
                    <div>
                        <strong id="precoMedioServicos">R$ 0,00</strong>
                        <small>Preço médio</small>
                    </div>
                </div>
            `);
            media = document.getElementById("precoMedioServicos");
        }
    }
    if (media) media.textContent = formatarMoeda(precoMedio);

    let filtrados = servicos.filter(item => {
        const ativo = item.ativo !== false;
        if (filtroAtual === "ativos" && !ativo) return false;
        if (filtroAtual === "inativos" && ativo) return false;
        if (!busca) return true;
        return `${item.nome || ""} ${item.preco || ""} ${item.duracao || ""}`
            .toLowerCase()
            .includes(busca);
    });

    if (servicos.length === 0) {
        lista.innerHTML = "";
        if (vazio) vazio.style.display = "block";
        return;
    }

    if (vazio) vazio.style.display = "none";

    if (filtrados.length === 0) {
        lista.innerHTML = `
            <div class="estado-vazio estado-vazio-filtro" style="display:block">
                <div class="vazio-icone">⌕</div>
                <h3>Nenhum serviço encontrado</h3>
                <p>Altere a busca ou o filtro para visualizar outros serviços.</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = filtrados.map(servico => {
        const ativo = servico.ativo !== false;
        return `
            <div class="servico-card ${ativo ? "" : "desativado"}">
                <div class="servico-info">
                    <div class="servico-icone">✂</div>
                    <div>
                        <h3>${escaparHTML(servico.nome)}</h3>
                        <div class="servico-meta">
                            <p>${formatarDuracao(servico.duracao)}</p>
                            <span class="servico-status">${ativo ? "ATIVO" : "INATIVO"}</span>
                        </div>
                    </div>
                </div>
                <div class="servico-direita">
                    <strong>${formatarMoeda(servico.preco)}</strong>
                    <div class="servico-acoes">
                        <button class="botao-mini" data-toggle-servico="${servico.id}" type="button" title="Ativar ou desativar">●</button>
                        <button class="botao-mini" data-editar-servico="${servico.id}" type="button" title="Editar">✎</button>
                        <button class="botao-mini" data-excluir-servico="${servico.id}" type="button" title="Excluir">🗑</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    document.querySelectorAll("[data-toggle-servico]").forEach(botao => {
        botao.addEventListener("click", () => alternarStatusServico(botao.dataset.toggleServico));
    });
    document.querySelectorAll("[data-editar-servico]").forEach(botao => {
        botao.addEventListener("click", () => editarServico(botao.dataset.editarServico));
    });
    document.querySelectorAll("[data-excluir-servico]").forEach(botao => {
        botao.addEventListener("click", () => excluirServico(botao.dataset.excluirServico));
    });
}

function alternarStatusServico(id) {
    const servicos = obterDados(CHAVES.servicos);
    const servico = servicos.find(item => String(item.id) === String(id));
    if (!servico) return;

    servico.ativo = servico.ativo === false;
    if (!salvarDados(CHAVES.servicos, servicos)) return;

    atualizarSelectServicos();
    renderizarServicos();
    mostrarMensagem(servico.ativo ? "Serviço ativado." : "Serviço desativado.");
}


function formatarDuracao(minutos) {

    minutos =
        Number(minutos || 0);

    if (minutos < 60) {

        return `${minutos} min`;
    }

    const horas =
        Math.floor(
            minutos / 60
        );

    const resto =
        minutos % 60;

    if (resto === 0) {

        return `${horas}h`;
    }

    return `${horas}h ${resto}min`;
}


/* ==========================================================
   NOVO SERVIÇO
========================================================== */

function abrirNovoServico() {

    const form =
        document.getElementById(
            "formServico"
        );

    if (form) {

        form.reset();

        delete form.dataset.editando;
    }

    const ativo =
        document.getElementById(
            "novoServicoAtivo"
        );

    if (ativo) {
        ativo.checked = true;
    }

    const titulo =
        document.querySelector(
            "#telaNovoServico h1"
        );

    if (titulo) {
        titulo.textContent =
            "Novo Serviço";
    }

    mostrarTela(
        "novoServico"
    );
}


/* ==========================================================
   EDITAR SERVIÇO
========================================================== */

function editarServico(id) {

    const servicos =
        obterDados(
            CHAVES.servicos
        );

    const servico =
        servicos.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (!servico) {
        return;
    }

    document.getElementById(
        "novoServicoNome"
    ).value =
        servico.nome || "";

    document.getElementById(
        "novoServicoPreco"
    ).value =
        servico.preco || "";

    document.getElementById(
        "novoServicoDuracao"
    ).value =
        servico.duracao || "";

    document.getElementById(
        "novoServicoAtivo"
    ).checked =
        servico.ativo !== false;

    const form =
        document.getElementById(
            "formServico"
        );

    if (form) {
        form.dataset.editando =
            servico.id;
    }

    const titulo =
        document.querySelector(
            "#telaNovoServico h1"
        );

    if (titulo) {
        titulo.textContent =
            "Editar Serviço";
    }

    mostrarTela(
        "novoServico"
    );
}


/* ==========================================================
   EXCLUIR SERVIÇO
========================================================== */

function excluirServico(id) {

    const servicos =
        obterDados(
            CHAVES.servicos
        );

    const servico =
        servicos.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (!servico) {
        return;
    }

    if (
        !confirm(
            `Excluir "${servico.nome}"?`
        )
    ) {
        return;
    }

    const novos =
        servicos.filter(
            item =>
                String(item.id) !==
                String(id)
        );

    if (
        !salvarDados(
            CHAVES.servicos,
            novos
        )
    ) {
        return;
    }

    renderizarServicos();

    atualizarSelectServicos();

    mostrarMensagem(
        "Serviço excluído."
    );
}


/* ==========================================================
   SELECT SERVIÇOS
========================================================== */

function atualizarSelectServicos() {

    const select =
        document.getElementById(
            "servico"
        );

    if (!select) {
        return;
    }

    const servicos =
        obterDados(
            CHAVES.servicos
        ).filter(
            item =>
                item.ativo !== false
        );

    select.innerHTML = `

        <option value="">
            Selecione um serviço
        </option>

        ${
            servicos.map(
                servico => `

                <option
                    value="${escaparHTML(
                        servico.nome
                    )}"
                    data-preco="${Number(
                        servico.preco || 0
                    )}"
                    data-duracao="${Number(
                        servico.duracao || 0
                    )}"
                >

                    ${escaparHTML(
                        servico.nome
                    )}

                </option>

                `
            ).join("")
        }

    `;
}

/* ==========================================================
   CLIENTES
========================================================== */

function renderizarClientes(filtro = "") {

    const lista =
        document.getElementById("listaClientes");

    const vazio =
        document.getElementById("estadoVazioClientes");

    if (!lista) {
        return;
    }

    const clientes =
        obterDados(CHAVES.clientes);

    const busca =
        String(filtro)
            .trim()
            .toLowerCase();

    const filtrados =
        clientes.filter(cliente => {

            const nome =
                String(cliente.nome || "")
                    .toLowerCase();

            const telefone =
                String(cliente.telefone || "")
                    .toLowerCase();

            return (
                nome.includes(busca) ||
                telefone.includes(busca)
            );
        });

    const total =
        document.getElementById("totalClientes");

    const ativos =
        document.getElementById("clientesAtivos");

    if (total) {
        total.textContent =
            clientes.length;
    }

    if (ativos) {
        ativos.textContent =
            clientes.length;
    }

    if (filtrados.length === 0) {

        lista.innerHTML = "";

        if (vazio) {
            vazio.style.display = "block";
        }

        return;
    }

    if (vazio) {
        vazio.style.display = "none";
    }

    lista.innerHTML =
        filtrados.map(cliente => `

            <button
                class="cliente-card"
                data-cliente="${cliente.id}"
                type="button"
            >

                <div class="cliente-avatar">
                    ${gerarIniciais(cliente.nome)}
                </div>

                <div class="cliente-info">

                    <strong>
                        ${escaparHTML(cliente.nome)}
                    </strong>

                    <span>
                        ${escaparHTML(
                            cliente.telefone ||
                            "Sem telefone"
                        )}
                    </span>

                </div>

                <div class="cliente-total">
                    ${contarAtendimentosCliente(cliente.id)}
                </div>

                <span class="cliente-seta">
                    ›
                </span>

            </button>

        `).join("");

    document
        .querySelectorAll("[data-cliente]")
        .forEach(botao => {

            botao.addEventListener(
                "click",
                () =>
                    abrirFichaCliente(
                        botao.dataset.cliente
                    )
            );
        });
}


function contarAtendimentosCliente(id) {

    return obterDados(
        CHAVES.agendamentos
    ).filter(
        item =>
            String(item.clienteId) ===
            String(id)
    ).length;
}


/* ==========================================================
   SUGESTÕES DE CLIENTES
========================================================== */

function atualizarSugestoesClientes() {

    const input =
        document.getElementById(
            "clienteNome"
        );

    const lista =
        document.getElementById(
            "clientesSugestoes"
        );

    if (!input || !lista) {
        return;
    }

    const clientes =
        obterDados(
            CHAVES.clientes
        );

    lista.innerHTML =
        clientes
            .sort(
                (a, b) =>
                    String(a.nome || "")
                        .localeCompare(
                            String(b.nome || ""),
                            "pt-BR"
                        )
            )
            .map(
                cliente => {

                    const telefone =
                        cliente.telefone || "";

                    return `
                        <option
                            value="${escaparHTML(
                                cliente.nome
                            )}"
                            label="${escaparHTML(
                                telefone
                            )}"
                        ></option>
                    `;
                }
            )
            .join("");
}


/* ==========================================================
   NOVO CLIENTE
========================================================== */

function abrirNovoCliente() {

    const form =
        document.getElementById(
            "formCliente"
        );

    if (form) {

        form.reset();

        delete form.dataset.editando;
    }

    const titulo =
        document.querySelector(
            "#telaNovoCliente h1"
        );

    if (titulo) {

        titulo.textContent =
            "Novo Cliente";
    }

    mostrarTela(
        "novoCliente"
    );
}


/* ==========================================================
   SALVAR CLIENTE
========================================================== */

function salvarCliente(event) {

    event.preventDefault();

    const form =
        event.currentTarget;

    const nome =
        document.getElementById(
            "novoClienteNome"
        );

    const telefone =
        document.getElementById(
            "novoClienteTelefone"
        );

    const email =
        document.getElementById(
            "novoClienteEmail"
        );

    const observacao =
        document.getElementById(
            "novoClienteObservacao"
        );

    if (
        !nome ||
        !nome.value.trim()
    ) {

        mostrarMensagem(
            "Digite o nome do cliente."
        );

        return;
    }

    const clientes =
        obterDados(
            CHAVES.clientes
        );

    const editando =
        form.dataset.editando;

    if (editando) {

        const index =
            clientes.findIndex(
                cliente =>
                    String(cliente.id) ===
                    String(editando)
            );

        if (index === -1) {

            mostrarMensagem(
                "Cliente não encontrado."
            );

            return;
        }

        clientes[index].nome =
            nome.value.trim();

        clientes[index].telefone =
            telefone
                ? telefone.value.trim()
                : "";

        clientes[index].email =
            email
                ? email.value.trim()
                : "";

        clientes[index].observacao =
            observacao
                ? observacao.value.trim()
                : "";

        mostrarMensagem(
            "Cliente atualizado."
        );

    } else {

        clientes.push({

            id:
                gerarId(),

            nome:
                nome.value.trim(),

            telefone:
                telefone
                    ? telefone.value.trim()
                    : "",

            email:
                email
                    ? email.value.trim()
                    : "",

            observacao:
                observacao
                    ? observacao.value.trim()
                    : "",

            criadoEm:
                new Date().toISOString()

        });

        mostrarMensagem(
            "Cliente cadastrado."
        );
    }

    if (
        !salvarDados(
            CHAVES.clientes,
            clientes
        )
    ) {
        return;
    }

    delete form.dataset.editando;

    renderizarClientes();

    atualizarSugestoesClientes();

    mostrarTela(
        "clientes"
    );
}


/* ==========================================================
   FICHA DO CLIENTE
========================================================== */

function abrirFichaCliente(id) {

    const clientes =
        obterDados(
            CHAVES.clientes
        );

    const cliente =
        clientes.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (!cliente) {
        return;
    }

    clienteFichaAtual =
        cliente;

    const avatar =
        document.getElementById(
            "fichaAvatar"
        );

    const nome =
        document.getElementById(
            "fichaNome"
        );

    const telefone =
        document.getElementById(
            "fichaTelefone"
        );

    const observacao =
        document.getElementById(
            "fichaObservacao"
        );

    if (avatar) {

        avatar.textContent =
            gerarIniciais(
                cliente.nome
            );
    }

    if (nome) {

        nome.textContent =
            cliente.nome;
    }

    if (telefone) {

        telefone.textContent =
            cliente.telefone ||
            "Sem telefone";
    }

    if (observacao) {

        observacao.textContent =
            cliente.observacao ||
            "Nenhuma observação cadastrada.";
    }

    atualizarResumoFicha(
        cliente
    );

    renderizarHistoricoCliente(
        cliente
    );

    mostrarTela(
        "fichaCliente"
    );
}


function atualizarResumoFicha(cliente) {

    const agendamentos =
        obterDados(
            CHAVES.agendamentos
        ).filter(
            item =>
                String(item.clienteId) ===
                String(cliente.id)
        );

    const atendimentos =
        document.getElementById(
            "fichaAtendimentos"
        );

    const total =
        document.getElementById(
            "fichaTotalGasto"
        );

    const ultimo =
        document.getElementById(
            "fichaUltimoAtendimento"
        );

    if (atendimentos) {

        atendimentos.textContent =
            agendamentos.length;
    }

    const valorTotal =
        agendamentos.reduce(
            (soma, item) =>
                soma +
                Number(item.valor || 0),
            0
        );

    if (total) {

        total.textContent =
            formatarMoeda(
                valorTotal
            );
    }

    const concluidos =
        agendamentos
            .filter(
                item =>
                    normalizarStatus(
                        item.status
                    ) === "concluido"
            )
            .sort(
                (a, b) =>
                    `${b.data}${b.hora}`
                        .localeCompare(
                            `${a.data}${a.hora}`
                        )
            );

    if (ultimo) {

        ultimo.textContent =
            concluidos.length
                ? formatarData(
                    concluidos[0].data
                )
                : "—";
    }
}


function renderizarHistoricoCliente(cliente) {

    const lista =
        document.getElementById(
            "historicoCliente"
        );

    if (!lista) {
        return;
    }

    const agendamentos =
        obterDados(
            CHAVES.agendamentos
        )
        .filter(
            item =>
                String(item.clienteId) ===
                String(cliente.id)
        )
        .sort(
            (a, b) =>
                `${b.data}${b.hora}`
                    .localeCompare(
                        `${a.data}${a.hora}`
                    )
        );

    if (agendamentos.length === 0) {

        lista.innerHTML = `

            <div class="estado-vazio pequeno">

                <div class="vazio-icone">
                    ✂
                </div>

                <p>
                    Nenhum atendimento registrado.
                </p>

            </div>

        `;

        return;
    }

    lista.innerHTML =
        agendamentos.map(
            item => `

            <div class="historico-item">

                <div>

                    <strong>
                        ${escaparHTML(
                            item.servico
                        )}
                    </strong>

                    <span>
                        ${formatarData(
                            item.data
                        )}
                        ·
                        ${escaparHTML(
                            item.hora
                        )}
                    </span>

                </div>

                <strong>
                    ${formatarMoeda(
                        item.valor
                    )}
                </strong>

            </div>

            `
        ).join("");
}


/* ==========================================================
   EDITAR CLIENTE
========================================================== */

function editarClienteAtual() {

    if (!clienteFichaAtual) {
        return;
    }

    const form =
        document.getElementById(
            "formCliente"
        );

    if (!form) {
        return;
    }

    document.getElementById(
        "novoClienteNome"
    ).value =
        clienteFichaAtual.nome || "";

    document.getElementById(
        "novoClienteTelefone"
    ).value =
        clienteFichaAtual.telefone || "";

    document.getElementById(
        "novoClienteEmail"
    ).value =
        clienteFichaAtual.email || "";

    document.getElementById(
        "novoClienteObservacao"
    ).value =
        clienteFichaAtual.observacao || "";

    form.dataset.editando =
        clienteFichaAtual.id;

    const titulo =
        document.querySelector(
            "#telaNovoCliente h1"
        );

    if (titulo) {

        titulo.textContent =
            "Editar Cliente";
    }

    mostrarTela(
        "novoCliente"
    );
}


/* ==========================================================
   EXCLUIR CLIENTE
========================================================== */

function excluirClienteAtual() {

    if (!clienteFichaAtual) {
        return;
    }

    if (
        !confirm(
            `Excluir o cliente "${clienteFichaAtual.nome}"?`
        )
    ) {
        return;
    }

    const clientes =
        obterDados(
            CHAVES.clientes
        );

    const novos =
        clientes.filter(
            cliente =>
                String(cliente.id) !==
                String(
                    clienteFichaAtual.id
                )
        );

    if (
        !salvarDados(
            CHAVES.clientes,
            novos
        )
    ) {
        return;
    }

    clienteFichaAtual = null;

    renderizarClientes();

    atualizarSugestoesClientes();

    mostrarMensagem(
        "Cliente excluído."
    );

    mostrarTela(
        "clientes"
    );
}


/* ==========================================================
   WHATSAPP
========================================================== */

function abrirWhatsAppCliente() {

    if (!clienteFichaAtual) {
        return;
    }

    let telefone =
        clienteFichaAtual.telefone ||
        "";

    telefone =
        telefone.replace(
            /\D/g,
            ""
        );

    if (!telefone) {

        mostrarMensagem(
            "Cliente sem telefone."
        );

        return;
    }

    if (
        !telefone.startsWith("55")
    ) {

        telefone =
            "55" + telefone;
    }

    window.open(
        `https://wa.me/${telefone}`,
        "_blank"
    );
}


/* ==========================================================
   AGENDA — CALENDÁRIO
========================================================== */

function renderizarCalendario() {

    const container =
        document.getElementById(
            "datasAgenda"
        );

    const mesTitulo =
        document.getElementById(
            "mesAgenda"
        );

    if (!container) {
        return;
    }

    const ano =
        mesAgendaAtual.getFullYear();

    const mes =
        mesAgendaAtual.getMonth();

    if (mesTitulo) {

        mesTitulo.textContent =
            `${nomeMes(mes)} ${ano}`;
    }

    const ultimoDia =
        new Date(
            ano,
            mes + 1,
            0
        ).getDate();

    let html = "";

    for (
        let dia = 1;
        dia <= ultimoDia;
        dia++
    ) {

        const data =
            `${ano}-` +
            `${String(mes + 1).padStart(2, "0")}-` +
            `${String(dia).padStart(2, "0")}`;

        const selecionada =
            data ===
            dataAgendaSelecionada;

        const hoje =
            data ===
            dataHojeISO();

        html += `

            <button
                class="
                    data-agenda
                    ${selecionada ? "selecionada" : ""}
                    ${hoje ? "hoje" : ""}
                "
                data-data="${data}"
                type="button"
            >

                <span>
                    ${nomeDiaSemana(data)}
                </span>

                <strong>
                    ${dia}
                </strong>

            </button>

        `;
    }

    container.innerHTML =
        html;

    container
        .querySelectorAll(
            "[data-data]"
        )
        .forEach(botao => {

            botao.addEventListener(
                "click",
                () => {

                    dataAgendaSelecionada =
                        botao.dataset.data;

                    renderizarCalendario();

                    renderizarAgenda();
                }
            );
        });
}


function nomeMes(mes) {

    const meses = [

        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"

    ];

    return meses[mes];
}


function nomeDiaSemana(data) {

    const partes =
        data.split("-");

    const objeto =
        new Date(
            Number(partes[0]),
            Number(partes[1]) - 1,
            Number(partes[2])
        );

    const dias = [

        "Dom",
        "Seg",
        "Ter",
        "Qua",
        "Qui",
        "Sex",
        "Sáb"

    ];

    return dias[
        objeto.getDay()
    ];
}

/* ==========================================================
   AGENDA — STATUS REAL DO FUNCIONAMENTO
========================================================== */

function renderizarFuncionamentoAgenda() {

    const status =
        document.getElementById(
            "funcionamentoStatus"
        );

    const indicador =
        document.getElementById(
            "funcionamentoIndicador"
        );

    const horarioFuncionamento =
        document.getElementById(
            "horarioFuncionamento"
        );

    const intervaloFuncionamento =
        document.getElementById(
            "intervaloFuncionamento"
        );

    const horarioIntervalo =
        document.getElementById(
            "horarioIntervalo"
        );

    if (
        !status ||
        !indicador ||
        !horarioFuncionamento
    ) {
        return;
    }


    /* ======================================================
       OBTER HORÁRIO CONFIGURADO
    ====================================================== */

    const horario =
        obterHorarioFuncionamento(
            dataAgendaSelecionada
        );


    if (!horario) {

        status.textContent =
            "Indisponível";

        indicador.textContent =
            "●";

        horarioFuncionamento.textContent =
            "Horário não definido";

        if (intervaloFuncionamento) {
            intervaloFuncionamento.style.display =
                "none";
        }

        return;
    }


    /* ======================================================
       DIA FECHADO
    ====================================================== */

    if (!horario.aberto) {

        status.textContent =
            "Fechado";

        indicador.textContent =
            "●";

        horarioFuncionamento.textContent =
            "Não há atendimento neste dia";

        if (intervaloFuncionamento) {
            intervaloFuncionamento.style.display =
                "none";
        }

        return;
    }


    /* ======================================================
       MOSTRAR HORÁRIO
    ====================================================== */

    horarioFuncionamento.textContent =
        `${horario.abertura} às ${horario.fechamento}`;


    const temIntervalo =
        horario.inicioIntervalo &&
        horario.fimIntervalo;


    if (
        intervaloFuncionamento &&
        horarioIntervalo
    ) {

        if (temIntervalo) {

            intervaloFuncionamento.style.display =
                "flex";

            horarioIntervalo.textContent =
                `${horario.inicioIntervalo} às ${horario.fimIntervalo}`;

        } else {

            intervaloFuncionamento.style.display =
                "none";
        }
    }


    /* ======================================================
       VERIFICAR SE A DATA SELECIONADA É HOJE
    ====================================================== */

    const hoje =
        dataHojeISO();


    const ehHoje =
        dataAgendaSelecionada === hoje;


    /*
       Se não for hoje, mostramos que o dia está
       disponível para atendimento.
    */

    if (!ehHoje) {

        status.textContent =
            "Aberto";

        indicador.textContent =
            "●";

        return;
    }


    /* ======================================================
       HORÁRIO ATUAL DO CELULAR
    ====================================================== */

    const agora =
        new Date();

    const horaAtual =
        agora.getHours();

    const minutoAtual =
        agora.getMinutes();


    const minutosAgora =
        horaAtual * 60 +
        minutoAtual;


    /* ======================================================
       CONVERTER HH:MM PARA MINUTOS
    ====================================================== */

    function converterHoraParaMinutos(hora) {

        if (!hora) {
            return null;
        }

        const partes =
            String(hora).split(":");

        if (partes.length !== 2) {
            return null;
        }

        return (
            Number(partes[0]) * 60 +
            Number(partes[1])
        );
    }


    const abertura =
        converterHoraParaMinutos(
            horario.abertura
        );

    const fechamento =
        converterHoraParaMinutos(
            horario.fechamento
        );

    const inicioIntervalo =
        converterHoraParaMinutos(
            horario.inicioIntervalo
        );

    const fimIntervalo =
        converterHoraParaMinutos(
            horario.fimIntervalo
        );


    /* ======================================================
       ANTES DA ABERTURA
    ====================================================== */

    if (
        abertura !== null &&
        minutosAgora < abertura
    ) {

        status.textContent =
            "Fechado";

        indicador.textContent =
            "●";

        return;
    }


    /* ======================================================
       DEPOIS DO FECHAMENTO
    ====================================================== */

    if (
        fechamento !== null &&
        minutosAgora >= fechamento
    ) {

        status.textContent =
            "Fechado";

        indicador.textContent =
            "●";

        return;
    }


    /* ======================================================
       DURANTE O INTERVALO
    ====================================================== */

    if (
        inicioIntervalo !== null &&
        fimIntervalo !== null &&
        minutosAgora >= inicioIntervalo &&
        minutosAgora < fimIntervalo
    ) {

        status.textContent =
            "Intervalo";

        indicador.textContent =
            "●";

        return;
    }


    /* ======================================================
       DENTRO DO HORÁRIO DE ATENDIMENTO
    ====================================================== */

    status.textContent =
        "Aberto";

    indicador.textContent =
        "●";
}
/* ==========================================================
   AGENDA RESUMIDA — TELA INICIAL
========================================================== */

function renderizarAgendaResumoHome() {

    const lista =
        document.getElementById(
            "agendaResumoHome"
        );

    if (!lista) {
        return;
    }


    const hoje =
        dataHojeISO();


    const agendamentos =
        obterDados(
            CHAVES.agendamentos
        )
        .filter(item => {

            return (
                item.data === hoje &&
                normalizarStatus(item.status) !== "cancelado"
            );

        })
        .sort(
            (a, b) =>
                String(a.hora || "")
                    .localeCompare(
                        String(b.hora || "")
                    )
        );


    /* ======================================================
       NENHUM AGENDAMENTO
    ====================================================== */

    if (agendamentos.length === 0) {

        lista.innerHTML = `

            <div class="estado-vazio pequeno">

                <div class="estado-icone">
                    📅
                </div>

                <h3>
                    Nenhum agendamento para hoje
                </h3>

                <p>
                    Os agendamentos realizados aparecerão aqui.
                </p>

            </div>

        `;

        return;
    }


    /* ======================================================
       MOSTRAR AGENDAMENTOS REAIS
    ====================================================== */

    lista.innerHTML =

        agendamentos
            .map(item => {

                const status =
                    normalizarStatus(
                        item.status
                    );

                return `

                    <button
                        class="item-agenda"
                        data-agendamento-home="${item.id}"
                        type="button"
                    >

                        <div class="hora-agenda">

                            <strong>
                                ${escaparHTML(
                                    item.hora || "--:--"
                                )}
                            </strong>

                        </div>


                        <div class="avatar-agenda">

                            ${gerarIniciais(
                                item.cliente || "Cliente"
                            )}

                        </div>


                        <div class="info-agenda">

                            <strong>

                                ${escaparHTML(
                                    item.cliente || "Cliente"
                                )}

                            </strong>

                            <span>

                                ${escaparHTML(
                                    item.servico || "Serviço"
                                )}

                            </span>

                        </div>


                        <span
                            class="
                                status
                                status-${status}
                            "
                        >

                            ${textoStatus(status)}

                        </span>

                    </button>

                `;

            })
            .join("");


    /* ======================================================
       ABRIR DETALHES
    ====================================================== */

    lista
        .querySelectorAll(
            "[data-agendamento-home]"
        )
        .forEach(botao => {

            botao.addEventListener(
                "click",
                () => {

                    abrirDetalhesAgendamento(
                        botao.dataset
                            .agendamentoHome
                    );

                }
            );

        });

}
/* ==========================================================
   AGENDA RESUMIDA — TELA INICIAL
========================================================== */

function renderizarAgendaResumoHome() {

    const lista =
        document.getElementById(
            "agendaResumoHome"
        );

    if (!lista) {
        return;
    }


    const hoje =
        dataHojeISO();


    const agendamentos =
        obterDados(
            CHAVES.agendamentos
        )
        .filter(item => {

            return (
                item.data === hoje &&
                normalizarStatus(item.status) !== "cancelado"
            );

        })
        .sort(
            (a, b) =>
                String(a.hora || "")
                    .localeCompare(
                        String(b.hora || "")
                    )
        );


    /* ======================================================
       NENHUM AGENDAMENTO
    ====================================================== */

    if (agendamentos.length === 0) {

        lista.innerHTML = `

            <div class="estado-vazio pequeno">

                <div class="estado-icone">
                    📅
                </div>

                <h3>
                    Nenhum agendamento para hoje
                </h3>

                <p>
                    Os agendamentos realizados aparecerão aqui.
                </p>

            </div>

        `;

        return;
    }


    /* ======================================================
       MOSTRAR AGENDAMENTOS REAIS
    ====================================================== */

    lista.innerHTML =

        agendamentos
            .map(item => {

                const status =
                    normalizarStatus(
                        item.status
                    );

                return `

                    <button
                        class="item-agenda"
                        data-agendamento-home="${item.id}"
                        type="button"
                    >

                        <div class="hora-agenda">

                            <strong>
                                ${escaparHTML(
                                    item.hora || "--:--"
                                )}
                            </strong>

                        </div>


                        <div class="avatar-agenda">

                            ${gerarIniciais(
                                item.cliente || "Cliente"
                            )}

                        </div>


                        <div class="info-agenda">

                            <strong>

                                ${escaparHTML(
                                    item.cliente || "Cliente"
                                )}

                            </strong>

                            <span>

                                ${escaparHTML(
                                    item.servico || "Serviço"
                                )}

                            </span>

                        </div>


                        <span
                            class="
                                status
                                status-${status}
                            "
                        >

                            ${textoStatus(status)}

                        </span>

                    </button>

                `;

            })
            .join("");


    /* ======================================================
       ABRIR DETALHES
    ====================================================== */

    lista
        .querySelectorAll(
            "[data-agendamento-home]"
        )
        .forEach(botao => {

            botao.addEventListener(
                "click",
                () => {

                    abrirDetalhesAgendamento(
                        botao.dataset
                            .agendamentoHome
                    );

                }
            );

        });

}

/* ==========================================================
   AGENDA — RENDERIZAÇÃO
========================================================== */

function obterDuracaoAgendamento(item, servicos = null) {

    const duracaoDireta = Number(item?.duracao || 0);

    if (duracaoDireta > 0) {
        return duracaoDireta;
    }

    const listaServicos =
        servicos || obterDados(CHAVES.servicos);

    const servico = listaServicos.find(itemServico =>
        String(itemServico.nome || "").trim() ===
        String(item?.servico || "").trim()
    );

    return Number(servico?.duracao || 30);
}


function verificarConflitoAgendamento(
    data,
    hora,
    duracao,
    agendamentos,
    ignorarId = null
) {

    const inicioNovo = horaParaMinutos(hora);

    if (inicioNovo === null) {
        return true;
    }

    const fimNovo =
        inicioNovo + Math.max(Number(duracao || 30), 30);

    return agendamentos.some(item => {

        if (String(item.id) === String(ignorarId)) {
            return false;
        }

        if (item.data !== data) {
            return false;
        }

        if (
            normalizarStatus(item.status) === "cancelado"
        ) {
            return false;
        }

        const inicioExistente =
            horaParaMinutos(item.hora);

        if (inicioExistente === null) {
            return false;
        }

        const fimExistente =
            inicioExistente +
            Math.max(Number(item.duracao || 30), 30);

        return (
            inicioNovo < fimExistente &&
            fimNovo > inicioExistente
        );
    });
}


function abrirNovoAgendamentoNoHorario(hora) {

    abrirNovoAgendamento();

    const data = document.getElementById("dataAgendamento");
    const campoHora = document.getElementById("horaAgendamento");

    if (data) {
        data.value = dataAgendaSelecionada || dataHojeISO();
    }

    if (campoHora) {
        campoHora.value = hora;
    }
}


function formatarHoraAgenda(minutos) {

    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;

    return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}


function renderizarAgenda() {

    const lista = document.getElementById("listaAgenda");
    const titulo = document.getElementById("tituloDataAgenda");

    if (!lista) {
        return;
    }

    renderizarFuncionamentoAgenda();

    if (titulo) {
        titulo.textContent =
            dataAgendaSelecionada === dataHojeISO()
                ? "Hoje"
                : formatarDataLonga(dataAgendaSelecionada);
    }

    const todosAgendamentos = obterDados(CHAVES.agendamentos)
        .filter(item => item.data === dataAgendaSelecionada)
        .sort((a, b) => String(a.hora || "").localeCompare(String(b.hora || "")));

    const agendamentos = todosAgendamentos.filter(item =>
        normalizarStatus(item.status) !== "cancelado"
    );

    const servicos = obterDados(CHAVES.servicos);
    const horario = obterHorarioFuncionamento(dataAgendaSelecionada);

    if (!horario || !horario.aberto) {
        lista.innerHTML = `
            <div class="estado-vazio agenda-fechada">
                <div class="estado-icone">🔒</div>
                <h3>Barbearia fechada</h3>
                <p>${escaparHTML(horario?.nome || "Neste dia")}</p>
            </div>
        `;
        return;
    }

    const abertura = horaParaMinutos(horario.abertura);
    const fechamento = horaParaMinutos(horario.fechamento);
    const inicioIntervalo = horaParaMinutos(horario.inicioIntervalo);
    const fimIntervalo = horaParaMinutos(horario.fimIntervalo);
    const intervaloValido =
        inicioIntervalo !== null &&
        fimIntervalo !== null &&
        fimIntervalo > inicioIntervalo;

    const eventos = [];
    const adicionados = new Set();

    agendamentos.forEach(item => {

        const inicio = horaParaMinutos(item.hora);

        if (inicio === null) {
            return;
        }

        const status = normalizarStatus(item.status);

        eventos.push({
            tipo: "agendamento",
            inicio,
            item,
            status
        });

        adicionados.add(String(item.id));
    });

    /*
       Mostra horários livres de 30 em 30 minutos.
       Um horário só aparece como livre quando os 30 minutos
       seguintes não entram em conflito com outro atendimento.
    */
    for (let inicio = abertura; inicio < fechamento; inicio += 30) {

        if (intervaloValido && inicio >= inicioIntervalo && inicio < fimIntervalo) {
            continue;
        }

        const hora = formatarHoraAgenda(inicio);

        const conflito = verificarConflitoAgendamento(
            dataAgendaSelecionada,
            hora,
            30,
            agendamentos
        );

        if (!conflito) {
            eventos.push({
                tipo: "livre",
                inicio,
                hora
            });
        }
    }

    if (intervaloValido) {
        eventos.push({
            tipo: "intervalo",
            inicio: inicioIntervalo,
            horaInicio: horario.inicioIntervalo,
            horaFim: horario.fimIntervalo
        });
    }

    eventos.sort((a, b) => {
        if (a.inicio !== b.inicio) {
            return a.inicio - b.inicio;
        }
        const ordem = { intervalo: 0, agendamento: 1, livre: 2 };
        return (ordem[a.tipo] || 9) - (ordem[b.tipo] || 9);
    });

    if (eventos.length === 0) {
        lista.innerHTML = `
            <div class="estado-vazio">
                <div class="estado-icone">📅</div>
                <h3>Agenda livre</h3>
                <p>Nenhum horário marcado para este dia.</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = eventos.map(evento => {

        if (evento.tipo === "intervalo") {
            return `
                <div class="agenda-intervalo">
                    <span>☕</span>
                    <div>
                        <strong>Intervalo</strong>
                        <small>${escaparHTML(evento.horaInicio)} às ${escaparHTML(evento.horaFim)}</small>
                    </div>
                </div>
            `;
        }

        if (evento.tipo === "livre") {
            return `
                <button
                    class="item-agenda agenda-livre"
                    data-horario-livre="${evento.hora}"
                    type="button"
                >
                    <div class="hora-agenda">
                        <strong>${evento.hora}</strong>
                    </div>
                    <div class="avatar-agenda avatar-livre">+</div>
                    <div class="info-agenda">
                        <strong>Horário livre</strong>
                        <span>Disponível para agendamento</span>
                    </div>
                    <span class="status status-livre">Livre</span>
                </button>
            `;
        }

        const item = evento.item;
        const status = evento.status;

        return `
            <button
                class="item-agenda status-item-${status}"
                data-agendamento="${item.id}"
                type="button"
            >
                <div class="hora-agenda">
                    <strong>${escaparHTML(item.hora || "--:--")}</strong>
                    <small>${obterDuracaoAgendamento(item, servicos)} min</small>
                </div>
                <div class="avatar-agenda">
                    ${gerarIniciais(item.cliente)}
                </div>
                <div class="info-agenda">
                    <strong>${escaparHTML(item.cliente || "Cliente")}</strong>
                    <span>${escaparHTML(item.servico || "Serviço")}</span>
                </div>
                <span class="status status-${status}">
                    ${textoStatus(status)}
                </span>
            </button>
        `;
    }).join("");

    lista.querySelectorAll("[data-agendamento]").forEach(botao => {
        botao.addEventListener("click", () =>
            abrirDetalhesAgendamento(botao.dataset.agendamento)
        );
    });

    lista.querySelectorAll("[data-horario-livre]").forEach(botao => {
        botao.addEventListener("click", () =>
            abrirNovoAgendamentoNoHorario(botao.dataset.horarioLivre)
        );
    });
}

/* ==========================================================
   STATUS
========================================================== */

function normalizarStatus(status) {

    if (
        status === "atendimento" ||
        status === "em_atendimento"
    ) {

        return "atendimento";
    }

    if (
        status === "concluido"
    ) {

        return "concluido";
    }

    if (
        status === "cancelado"
    ) {

        return "cancelado";
    }

    return "agendado";
}


function textoStatus(status) {

    const nomes = {

        agendado:
            "Agendado",

        atendimento:
            "Em atendimento",

        concluido:
            "Concluído",

        cancelado:
            "Cancelado"

    };

    return (
        nomes[status] ||
        "Agendado"
    );
}

/* ==========================================================
   NOVO AGENDAMENTO
========================================================== */

function abrirNovoAgendamento() {

    const form =
        document.getElementById(
            "formAgendamento"
        );

    if (form) {
        form.reset();
    }

    atualizarSelectServicos();
    atualizarSugestoesClientes();

    const data =
        document.getElementById(
            "dataAgendamento"
        );

    if (data) {

        data.value =
            dataAgendaSelecionada ||
            dataHojeISO();
    }

    const valor =
        document.getElementById(
            "valor"
        );

    if (valor) {
        valor.value = "";
    }

    mostrarTela("novo");
}

/* ==========================================================
   CONTROLE DE HORÁRIO DE FUNCIONAMENTO
========================================================== */

function obterChaveDia(data) {

    const partes =
        String(data).split("-");

    if (partes.length !== 3) {
        return null;
    }

    const dataObjeto =
        new Date(
            Number(partes[0]),
            Number(partes[1]) - 1,
            Number(partes[2])
        );

    const dias = [
        "domingo",
        "segunda",
        "terca",
        "quarta",
        "quinta",
        "sexta",
        "sabado"
    ];

    return dias[
        dataObjeto.getDay()
    ];
}


/* ==========================================================
   OBTER CONFIGURAÇÃO DOS HORÁRIOS
========================================================== */

function obterHorarioFuncionamento(data) {

    const dia =
        obterChaveDia(data);

    if (!dia) {
        return null;
    }

    let configuracoes = {};

    try {

        const salvo =
            localStorage.getItem(
                CONFIG_CHAVE
            );

        if (salvo) {

            configuracoes =
                JSON.parse(salvo);
        }

    } catch (erro) {

        console.error(
            "Erro ao ler horários:",
            erro
        );
    }


    const horarios =
        configuracoes.horarios || {};


    const padrao =
        HORARIOS_PADRAO[dia];


    const horarioSalvo =
        horarios[dia] || {};


    if (!padrao) {
        return null;
    }


    return {

        dia: dia,

        nome:
            padrao.nome,

        aberto:
            horarioSalvo.aberto !== undefined
                ? horarioSalvo.aberto
                : padrao.aberto,

        abertura:
            horarioSalvo.abertura ||
            padrao.abertura,

        inicioIntervalo:
            horarioSalvo.inicioIntervalo ||
            padrao.inicioIntervalo,

        fimIntervalo:
            horarioSalvo.fimIntervalo ||
            padrao.fimIntervalo,

        fechamento:
            horarioSalvo.fechamento ||
            padrao.fechamento

    };
}


/* ==========================================================
   CONVERTER HORA PARA MINUTOS
========================================================== */

function horaParaMinutos(hora) {

    if (!hora) {
        return null;
    }

    const partes =
        String(hora).split(":");

    if (partes.length !== 2) {
        return null;
    }

    const horas =
        Number(partes[0]);

    const minutos =
        Number(partes[1]);


    if (
        !Number.isFinite(horas) ||
        !Number.isFinite(minutos)
    ) {
        return null;
    }


    return (
        horas * 60 +
        minutos
    );
}

/* ==========================================================
   HORÁRIOS DISPONÍVEIS PARA AGENDAMENTO
========================================================== */

function gerarHorariosDisponiveis(
    data,
    duracao
) {

    const horario =
        obterHorarioFuncionamento(data);

    if (!horario || !horario.aberto) {
        return [];
    }


    const duracaoNumerica =
        Number(duracao || 0);


    /*
       Se o serviço não tiver duração,
       usamos blocos de 30 minutos.
    */

    const duracaoBloco =
        duracaoNumerica > 0
            ? duracaoNumerica
            : 30;


    const abertura =
        horaParaMinutos(
            horario.abertura
        );

    const fechamento =
        horaParaMinutos(
            horario.fechamento
        );


    if (
        abertura === null ||
        fechamento === null
    ) {

        return [];
    }


    /* ------------------------------------------
       INTERVALO
    ------------------------------------------ */

    const inicioIntervalo =
        horaParaMinutos(
            horario.inicioIntervalo
        );

    const fimIntervalo =
        horaParaMinutos(
            horario.fimIntervalo
        );


    const intervaloValido =
        inicioIntervalo !== null &&
        fimIntervalo !== null &&
        fimIntervalo > inicioIntervalo;


    /* ------------------------------------------
       AGENDAMENTOS EXISTENTES
    ------------------------------------------ */

    const agendamentos =
        obterDados(
            CHAVES.agendamentos
        )
        .filter(item => {

            if (item.data !== data) {
                return false;
            }

            /*
               Cancelados não ocupam horário.
            */

            return (
                normalizarStatus(
                    item.status
                ) !== "cancelado"
            );
        });


    const horariosDisponiveis = [];


    /* ------------------------------------------
       GERAR HORÁRIOS
    ------------------------------------------ */

    for (
        let inicio = abertura;
        inicio < fechamento;
        inicio += duracaoBloco
    ) {

        const fim =
            inicio +
            duracaoNumerica;


        /*
           O serviço precisa terminar
           antes ou exatamente no fechamento.
        */

        if (
            duracaoNumerica > 0 &&
            fim > fechamento
        ) {
            continue;
        }


        /*
           VERIFICAR INTERVALO
        */

        if (intervaloValido) {

            /*
               Começa durante o intervalo.
            */

            if (
                inicio >= inicioIntervalo &&
                inicio < fimIntervalo
            ) {

                continue;
            }


            /*
               Atravessa o intervalo.
            */

            if (
                duracaoNumerica > 0 &&
                inicio < inicioIntervalo &&
                fim > inicioIntervalo
            ) {

                continue;
            }
        }


        /*
           VERIFICAR CONFLITO COM
           AGENDAMENTOS EXISTENTES
        */

        const conflito =
            agendamentos.some(
                agendamento => {

                    const inicioExistente =
                        horaParaMinutos(
                            agendamento.hora
                        );

                    if (
                        inicioExistente === null
                    ) {
                        return false;
                    }


                    const duracaoExistente =
                        Number(
                            agendamento.duracao || 0
                        );


                    const fimExistente =
                        inicioExistente +
                        Math.max(
                            duracaoExistente,
                            0
                        );


                    /*
                       Se o agendamento antigo
                       não possuir duração,
                       consideramos um bloco
                       de 30 minutos.
                    */

                    const fimExistenteAjustado =
                        duracaoExistente > 0
                            ? fimExistente
                            : inicioExistente + 30;


                    /*
                       Verifica se os períodos
                       se sobrepõem.
                    */

                    return (
                        inicio <
                            fimExistenteAjustado &&
                        (
                            inicio +
                            duracaoBloco
                        ) >
                            inicioExistente
                    );

                }
            );


        if (conflito) {
            continue;
        }


        /*
           CONVERTER MINUTOS PARA HH:MM
        */

        const horas =
            Math.floor(
                inicio / 60
            );

        const minutos =
            inicio % 60;


        const horaFormatada =
            `${String(horas).padStart(2, "0")}:` +
            `${String(minutos).padStart(2, "0")}`;


        horariosDisponiveis.push(
            horaFormatada
        );
    }


    return horariosDisponiveis;
}

/* ==========================================================
   VALIDAR HORÁRIO DO AGENDAMENTO
========================================================== */

function validarHorarioFuncionamento(
    data,
    hora,
    duracao
) {

    const horario =
        obterHorarioFuncionamento(data);


    if (!horario) {

        return {
            valido: false,
            mensagem:
                "Não foi possível verificar o horário."
        };
    }


    /* ------------------------------------------
       DIA FECHADO
    ------------------------------------------ */

    if (!horario.aberto) {

        return {
            valido: false,
            mensagem:
                `A barbearia está fechada na ${horario.nome}.`
        };
    }


    const inicio =
        horaParaMinutos(hora);

    const abertura =
        horaParaMinutos(
            horario.abertura
        );

    const fechamento =
        horaParaMinutos(
            horario.fechamento
        );


    if (
        inicio === null ||
        abertura === null ||
        fechamento === null
    ) {

        return {
            valido: false,
            mensagem:
                "Horário de funcionamento inválido."
        };
    }


    /* ------------------------------------------
       DURAÇÃO DO SERVIÇO
    ------------------------------------------ */

    const duracaoNumerica =
        Number(duracao || 0);


    const fim =
        inicio +
        Math.max(
            duracaoNumerica,
            0
        );


    /* ------------------------------------------
       ANTES DA ABERTURA
    ------------------------------------------ */

    if (inicio < abertura) {

        return {
            valido: false,
            mensagem:
                `A barbearia abre às ${horario.abertura}.`
        };
    }


    /* ------------------------------------------
       DEPOIS DO FECHAMENTO
    ------------------------------------------ */

    if (inicio >= fechamento) {

        return {
            valido: false,
            mensagem:
                `A barbearia fecha às ${horario.fechamento}.`
        };
    }


    /* ------------------------------------------
       SERVIÇO TERMINA DEPOIS DO FECHAMENTO
    ------------------------------------------ */

    if (
        duracaoNumerica > 0 &&
        fim > fechamento
    ) {

        return {
            valido: false,
            mensagem:
                `Esse serviço termina depois do fechamento (${horario.fechamento}).`
        };
    }


    /* ------------------------------------------
       INTERVALO
    ------------------------------------------ */

    const inicioIntervalo =
        horaParaMinutos(
            horario.inicioIntervalo
        );

    const fimIntervalo =
        horaParaMinutos(
            horario.fimIntervalo
        );


    const intervaloValido =
        inicioIntervalo !== null &&
        fimIntervalo !== null &&
        fimIntervalo > inicioIntervalo;


    if (intervaloValido) {


        /* COMEÇA NO INTERVALO */

        if (
            inicio >= inicioIntervalo &&
            inicio < fimIntervalo
        ) {

            return {
                valido: false,
                mensagem:
                    `Este horário está no intervalo (${horario.inicioIntervalo} às ${horario.fimIntervalo}).`
            };
        }


        /* ATRAVESSA O INTERVALO */

        if (
            duracaoNumerica > 0 &&
            inicio < inicioIntervalo &&
            fim > inicioIntervalo
        ) {

            return {
                valido: false,
                mensagem:
                    `O serviço atravessa o intervalo (${horario.inicioIntervalo} às ${horario.fimIntervalo}).`
            };
        }

    }


    return {
        valido: true,
        mensagem: ""
    };
}


/* ==========================================================
   SALVAR AGENDAMENTO
========================================================== */

function salvarAgendamento(event) {

    event.preventDefault();

    try {

        const form =
            document.getElementById(
                "formAgendamento"
            );

        const clienteInput =
            document.getElementById(
                "clienteNome"
            );

        const servicoSelect =
            document.getElementById(
                "servico"
            );

        const dataInput =
            document.getElementById(
                "dataAgendamento"
            );

        const horaInput =
            document.getElementById(
                "horaAgendamento"
            );

        const valorInput =
            document.getElementById(
                "valor"
            );

        const observacaoInput =
            document.getElementById(
                "observacao"
            );

        if (
            !form ||
            !clienteInput ||
            !servicoSelect ||
            !dataInput ||
            !horaInput
        ) {

            mostrarMensagem(
                "Erro no formulário."
            );

            return;
        }

        const clienteNome =
            clienteInput.value.trim();

        const servicoNome =
            servicoSelect.value.trim();

        const data =
            dataInput.value;

        const hora =
            horaInput.value;

        if (!clienteNome) {

            mostrarMensagem(
                "Digite o nome do cliente."
            );

            clienteInput.focus();

            return;
        }

        if (!servicoNome) {

            mostrarMensagem(
                "Selecione um serviço."
            );

            return;
        }

        if (!data) {

            mostrarMensagem(
                "Informe a data."
            );

            return;
        }

        if (!hora) {

            mostrarMensagem(
                "Informe o horário."
            );

            return;
        }

        if (!testarArmazenamento()) {

            mostrarMensagem(
                "O armazenamento está indisponível."
            );

            return;
        }

        const agendamentos =
            obterDados(
                CHAVES.agendamentos
            );

        const clientes =
            obterDados(
                CHAVES.clientes
            );

        const servicos =
            obterDados(
                CHAVES.servicos
            );


        /* CONFLITO DE HORÁRIO / DURAÇÃO */

        const duracaoSelecionada =
            Number(
                servicoSelect.options[
                    servicoSelect.selectedIndex
                ]?.dataset.duracao || 30
            );

        const conflitoHorario =
            verificarConflitoAgendamento(
                data,
                hora,
                duracaoSelecionada,
                agendamentos
            );

        if (conflitoHorario) {

            mostrarMensagem(
                "Este horário entra em conflito com outro atendimento."
            );

            return;
        }

        /* HORÁRIO DUPLICADO */

        const horarioOcupado =
            agendamentos.some(item => {

                const mesmoDia =
                    item.data === data;

                const mesmaHora =
                    item.hora === hora;

                const cancelado =
                    normalizarStatus(
                        item.status
                    ) === "cancelado";

                return (
                    mesmoDia &&
                    mesmaHora &&
                    !cancelado
                );
            });

        if (horarioOcupado) {

            mostrarMensagem(
                "Este horário já está ocupado."
            );

            return;
        }

/* ==================================================
   VERIFICAR HORÁRIO DE FUNCIONAMENTO
================================================== */

const duracaoFuncionamento =
    servicoSelect.options[
        servicoSelect.selectedIndex
    ]?.dataset.duracao || 0;


const validacaoHorario =
    validarHorarioFuncionamento(
        data,
        hora,
        Number(duracaoFuncionamento)
    );


if (!validacaoHorario.valido) {

    mostrarMensagem(
        validacaoHorario.mensagem
    );

    return;
}
        /* LOCALIZAR CLIENTE */

        let cliente =
            clientes.find(item =>
                String(
                    item.nome || ""
                )
                .trim()
                .toLowerCase() ===
                clienteNome.toLowerCase()
            );


        /* CRIAR CLIENTE AUTOMATICAMENTE */

        if (!cliente) {

            cliente = {

                id:
                    gerarId(),

                nome:
                    clienteNome,

                telefone:
                    "",

                email:
                    "",

                observacao:
                    "",

                criadoEm:
                    new Date()
                        .toISOString()

            };

            clientes.push(cliente);

            if (
                !salvarDados(
                    CHAVES.clientes,
                    clientes
                )
            ) {

                mostrarMensagem(
                    "Não foi possível criar o cliente."
                );

                return;
            }
        }


        /* LOCALIZAR SERVIÇO */

        const servico =
            servicos.find(item =>
                String(
                    item.nome || ""
                ).trim() ===
                servicoNome
            );


        /* VALOR */

        let valor = 0;

        if (
            valorInput &&
            valorInput.value !== ""
        ) {

            valor =
                Number(
                    String(
                        valorInput.value
                    )
                    .trim()
                    .replace(",", ".")
                );
        }

        if (!Number.isFinite(valor)) {

            valor =
                servico
                    ? Number(
                        servico.preco || 0
                    )
                    : 0;
        }


        /* DURAÇÃO */

        const duracao =
            servico
                ? Number(
                    servico.duracao || 0
                )
                : 0;


        /* OBSERVAÇÃO */

        const observacao =
            observacaoInput
                ? observacaoInput.value.trim()
                : "";


        /* NOVO AGENDAMENTO */

        const novoAgendamento = {

            id:
                gerarId(),

            clienteId:
                cliente.id,

            cliente:
                cliente.nome,

            telefone:
                cliente.telefone || "",

            servico:
                servicoNome,

            data:
                data,

            hora:
                hora,

            valor:
                valor,

            duracao:
                duracao,

            observacao:
                observacao,

            status:
                "agendado",

            criadoEm:
                new Date()
                    .toISOString()

        };


        agendamentos.push(
            novoAgendamento
        );


        if (
            !salvarDados(
                CHAVES.agendamentos,
                agendamentos
            )
        ) {

            mostrarMensagem(
                "Não foi possível salvar o agendamento."
            );

            return;
        }


        /* CONFERÊNCIA */

        const conferidos =
            obterDados(
                CHAVES.agendamentos
            );

        const encontrado =
            conferidos.some(
                item =>
                    String(item.id) ===
                    String(
                        novoAgendamento.id
                    )
            );

        if (!encontrado) {

            mostrarMensagem(
                "O agendamento não foi gravado."
            );

            return;
        }


        /* ATUALIZAR AGENDA */

        dataAgendaSelecionada =
            data;

        const partes =
            data.split("-");

        if (partes.length === 3) {

            mesAgendaAtual =
                new Date(
                    Number(partes[0]),
                    Number(partes[1]) - 1,
                    1
                );
        }


        renderizarCalendario();
        renderizarAgenda();
        renderizarClientes();
        atualizarSugestoesClientes();
        atualizarResumoHome();
        renderizarFinanceiro();


        if (form) {
            form.reset();
        }

        mostrarTela("agenda");

        mostrarMensagem(
            "Agendamento salvo com sucesso!"
        );

    } catch (erro) {

        console.error(
            "BARBER R.D ERRO:",
            erro
        );

        mostrarMensagem(
            "Erro ao salvar o agendamento."
        );
    }
}


/* ==========================================================
   DETALHES DO AGENDAMENTO
========================================================== */

function abrirDetalhesAgendamento(id) {

    const agendamentos =
        obterDados(
            CHAVES.agendamentos
        );

    const agendamento =
        agendamentos.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (!agendamento) {
        return;
    }

    agendamentoAtual =
        agendamento;

    const clientes =
        obterDados(
            CHAVES.clientes
        );

    const cliente =
        clientes.find(
            item =>
                String(item.id) ===
                String(
                    agendamento.clienteId
                )
        );

    const servicos =
        obterDados(
            CHAVES.servicos
        );

    const servico =
        servicos.find(
            item =>
                item.nome ===
                agendamento.servico
        );

    const nome =
        agendamento.cliente ||
        cliente?.nome ||
        "Cliente";

    const telefone =
        cliente?.telefone ||
        agendamento.telefone ||
        "Sem telefone";

    const duracao =
        Number(
            agendamento.duracao ||
            servico?.duracao ||
            0
        );

    const valor =
        Number(
            agendamento.valor ??
            servico?.preco ??
            0
        );

    const status =
        normalizarStatus(
            agendamento.status
        );


    const avatar =
        document.getElementById(
            "detalheAvatar"
        );

    const nomeEl =
        document.getElementById(
            "detalheCliente"
        );

    const telefoneEl =
        document.getElementById(
            "detalheTelefone"
        );

    const servicoEl =
        document.getElementById(
            "detalheServico"
        );

    const dataEl =
        document.getElementById(
            "detalheData"
        );

    const horaEl =
        document.getElementById(
            "detalheHora"
        );

    const duracaoEl =
        document.getElementById(
            "detalheDuracao"
        );

    const valorEl =
        document.getElementById(
            "detalheValor"
        );

    const statusEl =
        document.getElementById(
            "detalheStatus"
        );

    const observacaoEl =
        document.getElementById(
            "detalheObservacao"
        );


    if (avatar) {
        avatar.textContent =
            gerarIniciais(nome);
    }

    if (nomeEl) {
        nomeEl.textContent =
            nome;
    }

    if (telefoneEl) {
        telefoneEl.textContent =
            telefone;
    }

    if (servicoEl) {
        servicoEl.textContent =
            agendamento.servico || "—";
    }

    if (dataEl) {
        dataEl.textContent =
            formatarData(
                agendamento.data
            );
    }

    if (horaEl) {
        horaEl.textContent =
            agendamento.hora || "—";
    }

    if (duracaoEl) {
        duracaoEl.textContent =
            formatarDuracao(duracao);
    }

    if (valorEl) {
        valorEl.textContent =
            formatarMoeda(valor);
    }

    if (statusEl) {

        statusEl.className =
            `status status-${status}`;

        statusEl.textContent =
            textoStatus(status);
    }

    if (observacaoEl) {

        observacaoEl.textContent =
            agendamento.observacao ||
            "Nenhuma observação.";
    }

    atualizarBotoesAtendimento(
        status
    );

    mostrarTela("detalhes");
}


/* ==========================================================
   BOTÕES DE ATENDIMENTO
========================================================== */

function atualizarBotoesAtendimento(status) {

    const iniciar =
        document.getElementById(
            "btnIniciarAtendimento"
        );

    const concluir =
        document.getElementById(
            "btnConcluirAtendimento"
        );

    const cancelar =
        document.getElementById(
            "btnCancelarAtendimento"
        );

    if (iniciar) {

        iniciar.style.display =
            status === "agendado"
                ? "flex"
                : "none";
    }

    if (concluir) {

        concluir.style.display =
            status === "atendimento"
                ? "flex"
                : "none";
    }

    if (cancelar) {

        cancelar.style.display =
            (
                status === "concluido" ||
                status === "cancelado"
            )
                ? "none"
                : "flex";
    }
}


/* ==========================================================
   ALTERAR STATUS
========================================================== */

function alterarStatusAgendamento(
    novoStatus
) {

    if (!agendamentoAtual) {
        return;
    }

    const agendamentos =
        obterDados(
            CHAVES.agendamentos
        );

    const index =
        agendamentos.findIndex(
            item =>
                String(item.id) ===
                String(
                    agendamentoAtual.id
                )
        );

    if (index === -1) {
        return;
    }

    agendamentos[index].status =
        novoStatus;

    agendamentos[index].atualizadoEm =
        new Date()
            .toISOString();

    if (
        !salvarDados(
            CHAVES.agendamentos,
            agendamentos
        )
    ) {
        return;
    }

    agendamentoAtual =
        agendamentos[index];

    atualizarBotoesAtendimento(
        novoStatus
    );

    const statusEl =
        document.getElementById(
            "detalheStatus"
        );

    if (statusEl) {

        statusEl.className =
            `status status-${novoStatus}`;

        statusEl.textContent =
            textoStatus(
                novoStatus
            );
    }

    renderizarAgenda();
    renderizarClientes();
    atualizarResumoHome();
    renderizarFinanceiro();

    mostrarMensagem(
        textoStatus(novoStatus)
    );
}


/* ==========================================================
   MÊS ANTERIOR
========================================================== */

function mesAnterior() {

    mesAgendaAtual.setMonth(
        mesAgendaAtual.getMonth() - 1
    );

    ajustarDataParaMes();

    renderizarCalendario();
    renderizarAgenda();
}


/* ==========================================================
   MÊS PRÓXIMO
========================================================== */

function mesProximo() {

    mesAgendaAtual.setMonth(
        mesAgendaAtual.getMonth() + 1
    );

    ajustarDataParaMes();

    renderizarCalendario();
    renderizarAgenda();
}


/* ==========================================================
   AJUSTAR DATA AO MÊS
========================================================== */

function ajustarDataParaMes() {

    const ano =
        mesAgendaAtual.getFullYear();

    const mes =
        mesAgendaAtual.getMonth();

    const partes =
        dataAgendaSelecionada.split("-");

    let dia =
        Number(partes[2]);

    const ultimo =
        new Date(
            ano,
            mes + 1,
            0
        ).getDate();

    if (dia > ultimo) {
        dia = ultimo;
    }

    dataAgendaSelecionada =
        `${ano}-` +
        `${String(mes + 1).padStart(2, "0")}-` +
        `${String(dia).padStart(2, "0")}`;
}


/* ==========================================================
   IR PARA HOJE
========================================================== */

function irParaHoje() {

    const hoje =
        new Date();

    dataAgendaSelecionada =
        dataHojeISO();

    mesAgendaAtual =
        new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            1
        );

    renderizarCalendario();
    renderizarAgenda();
}


/* ==========================================================
   RESUMO DA HOME
========================================================== */

function atualizarResumoHome() {

    const hoje =
        dataHojeISO();

    const agendamentos =
        obterDados(
            CHAVES.agendamentos
        );

    const clientes =
        obterDados(
            CHAVES.clientes
        );

    const hojeAgendamentos =
        agendamentos.filter(
            item =>
                item.data === hoje &&
                normalizarStatus(
                    item.status
                ) !== "cancelado"
        );

    const concluidos =
        hojeAgendamentos.filter(
            item =>
                normalizarStatus(
                    item.status
                ) === "concluido"
        );

    const faturamento =
        concluidos.reduce(
            (soma, item) =>
                soma +
                Number(item.valor || 0),
            0
        );

    const cards =
        document.querySelectorAll(
            "#telaInicio .card-resumo"
        );

    if (cards.length >= 3) {

        const atendimento =
            cards[0].querySelector("strong");

        const faturamentoEl =
            cards[1].querySelector("strong");

        const clientesEl =
            cards[2].querySelector("strong");


        if (atendimento) {

            atendimento.textContent =
                hojeAgendamentos.length;
        }

        if (faturamentoEl) {

            faturamentoEl.textContent =
                formatarMoeda(
                    faturamento
                ).replace(
                    "R$ ",
                    ""
                );
        }

        if (clientesEl) {

            clientesEl.textContent =
                clientes.length;
        }
    }
}


/* ==========================================================
   ETAPA 2 — HOME / DASHBOARD INTELIGENTE
========================================================== */

function obterNomeBarbeiroHomeRD() {

    try {
        const salvo = localStorage.getItem(CONFIG_CHAVE);
        if (salvo) {
            const config = JSON.parse(salvo);
            if (config && config.nomeBarbeiro) {
                return String(config.nomeBarbeiro).trim();
            }
        }
    } catch (erro) {
        console.warn("Não foi possível ler o nome do barbeiro.", erro);
    }

    return "Barbeiro";
}


function obterStatusFuncionamentoHomeRD() {

    const hoje = dataHojeISO();
    const horario = obterHorarioFuncionamento(hoje);

    if (!horario) {
        return {
            texto: "Horário indisponível",
            detalhe: "Configure o funcionamento",
            classe: "fechado"
        };
    }

    if (!horario.aberto) {
        return {
            texto: "Fechado",
            detalhe: "Não há atendimento hoje",
            classe: "fechado"
        };
    }

    const agora = new Date();
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    const converter = hora => {
        if (!hora) return null;
        const partes = String(hora).split(":");
        if (partes.length !== 2) return null;
        return Number(partes[0]) * 60 + Number(partes[1]);
    };

    const abertura = converter(horario.abertura);
    const fechamento = converter(horario.fechamento);
    const inicioIntervalo = converter(horario.inicioIntervalo);
    const fimIntervalo = converter(horario.fimIntervalo);

    if (
        inicioIntervalo !== null &&
        fimIntervalo !== null &&
        minutosAgora >= inicioIntervalo &&
        minutosAgora < fimIntervalo
    ) {
        return {
            texto: "Intervalo",
            detalhe: `${horario.inicioIntervalo} às ${horario.fimIntervalo}`,
            classe: "intervalo"
        };
    }

    if (
        abertura !== null &&
        fechamento !== null &&
        minutosAgora >= abertura &&
        minutosAgora < fechamento
    ) {
        return {
            texto: "Aberto",
            detalhe: `${horario.abertura} às ${horario.fechamento}`,
            classe: "aberto"
        };
    }

    return {
        texto: "Fechado",
        detalhe: `${horario.abertura} às ${horario.fechamento}`,
        classe: "fechado"
    };
}


function obterProximoAtendimentoHomeRD(agendamentos) {

    const hoje = dataHojeISO();
    const agora = new Date();
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    const converter = hora => {
        const partes = String(hora || "00:00").split(":");
        return Number(partes[0]) * 60 + Number(partes[1]);
    };

    const hojeLista = agendamentos
        .filter(item => {
            if (item.data !== hoje) return false;
            if (normalizarStatus(item.status) === "cancelado") return false;
            return true;
        })
        .sort((a, b) => String(a.hora || "").localeCompare(String(b.hora || "")));

    const emAtendimento = hojeLista.find(item => normalizarStatus(item.status) === "em_atendimento");
    if (emAtendimento) return emAtendimento;

    return hojeLista.find(item => converter(item.hora) >= minutosAgora) || null;
}


function renderizarProximoAtendimentoHomeRD(agendamentos) {

    const container = document.getElementById("homeProximoAtendimento");
    if (!container) return;

    const proximo = obterProximoAtendimentoHomeRD(agendamentos);

    if (!proximo) {
        container.innerHTML = `
            <div class="home-proximo-vazio">
                <span>📅</span>
                <strong>Nenhum próximo atendimento</strong>
                <small>Não há mais horários agendados para hoje.</small>
            </div>
        `;
        return;
    }

    const status = normalizarStatus(proximo.status);

    container.innerHTML = `
        <button
            type="button"
            class="home-proximo-atendimento"
            data-home-proximo-id="${escaparHTML(proximo.id || "")}" 
        >
            <div class="home-proximo-hora">
                <strong>${escaparHTML(proximo.hora || "--:--")}</strong>
                <small>${escaparHTML(textoStatus(status))}</small>
            </div>

            <div class="home-proximo-avatar">
                ${gerarIniciais(proximo.cliente || "Cliente")}
            </div>

            <div class="home-proximo-info">
                <strong>${escaparHTML(proximo.cliente || "Cliente")}</strong>
                <span>${escaparHTML(proximo.servico || "Serviço")}</span>
            </div>
        </button>
    `;

    const botao = container.querySelector("[data-home-proximo-id]");
    if (botao) {
        botao.addEventListener("click", () => {
            abrirDetalhesAgendamento(botao.dataset.homeProximoId);
        });
    }
}


function atualizarDashboardHomeRD() {

    const hoje = dataHojeISO();
    const agendamentos = obterDados(CHAVES.agendamentos);

    const hojeAgendamentos = agendamentos.filter(item =>
        item.data === hoje &&
        normalizarStatus(item.status) !== "cancelado"
    );

    const concluidos = hojeAgendamentos.filter(item =>
        normalizarStatus(item.status) === "concluido"
    );

    const faturamento = concluidos.reduce(
        (total, item) => total + Number(item.valor || 0),
        0
    );

    const nome = obterNomeBarbeiroHomeRD();
    const hora = new Date().getHours();
    let saudacao = "Bom dia";
    if (hora >= 12 && hora < 18) saudacao = "Boa tarde";
    if (hora >= 18) saudacao = "Boa noite";

    const elSaudacao = document.getElementById("homeSaudacao");
    const elData = document.getElementById("homeDataAtual");
    const elTotal = document.getElementById("homeTotalAgendamentos");
    const elConcluidos = document.getElementById("homeTotalConcluidos");
    const elFaturamento = document.getElementById("homeFaturamento");

    if (elSaudacao) elSaudacao.textContent = `${saudacao}, ${nome}! 👋`;
    if (elData) elData.textContent = formatarDataLonga(hoje).toUpperCase();
    if (elTotal) elTotal.textContent = hojeAgendamentos.length;
    if (elConcluidos) elConcluidos.textContent = concluidos.length;
    if (elFaturamento) elFaturamento.textContent = formatarMoeda(faturamento);

    const status = obterStatusFuncionamentoHomeRD();
    const cardStatus = document.getElementById("homeStatusCard");
    const textoStatusEl = document.getElementById("homeStatusTexto");
    const horarioEl = document.getElementById("homeStatusHorario");

    if (cardStatus) {
        cardStatus.classList.remove("aberto", "fechado", "intervalo");
        cardStatus.classList.add(status.classe);
    }
    if (textoStatusEl) textoStatusEl.textContent = status.texto;
    if (horarioEl) horarioEl.textContent = status.detalhe;

    const diaEl = document.getElementById("homeStatusDia");
    if (diaEl) diaEl.textContent = formatarData(hoje);

    renderizarProximoAtendimentoHomeRD(agendamentos);
    renderizarAgendaResumoHome();
}


/* ==========================================================
   FINANCEIRO
========================================================== */

function obterDataObjeto(data) {

    if (!data) {
        return null;
    }

    const partes =
        String(data).split("-");

    if (partes.length !== 3) {
        return null;
    }

    return new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2])
    );
}


/* ==========================================================
   VERIFICAR SE É MESMO DIA
========================================================== */

function mesmoDia(data1, data2) {

    return data1 === data2;
}


/* ==========================================================
   VERIFICAR SEMANA ATUAL
========================================================== */

function pertenceSemanaAtual(data) {

    const objeto =
        obterDataObjeto(data);

    if (!objeto) {
        return false;
    }

    const hoje =
        obterDataObjeto(
            dataHojeISO()
        );

    if (!hoje) {
        return false;
    }

    const diaSemana =
        hoje.getDay();

    const inicio =
        new Date(hoje);

    inicio.setDate(
        hoje.getDate() -
        diaSemana
    );

    inicio.setHours(
        0, 0, 0, 0
    );

    const fim =
        new Date(inicio);

    fim.setDate(
        inicio.getDate() + 6
    );

    fim.setHours(
        23, 59, 59, 999
    );

    return (
        objeto >= inicio &&
        objeto <= fim
    );
}


/* ==========================================================
   FILTRAR CONCLUÍDOS
========================================================== */

function obterAtendimentosConcluidos() {

    return obterDados(
        CHAVES.agendamentos
    ).filter(
        item =>
            normalizarStatus(
                item.status
            ) === "concluido"
    );
}


/* ==========================================================
   FILTRO DO FINANCEIRO — ETAPA 6
========================================================== */

let financeiroPeriodoAtual = "mes";

function obterIntervaloFinanceiro(periodo = financeiroPeriodoAtual) {

    const hoje = dataHojeISO();

    if (periodo === "hoje") {
        return { inicio: hoje, fim: hoje, rotulo: "FATURAMENTO DE HOJE", info: "Exibindo somente hoje" };
    }

    if (periodo === "semana") {
        const h = obterDataObjeto(hoje);
        const inicio = new Date(h);
        inicio.setDate(h.getDate() - h.getDay());
        const fim = new Date(inicio);
        fim.setDate(inicio.getDate() + 6);
        return { inicio: formatarISODate(inicio), fim: formatarISODate(fim), rotulo: "FATURAMENTO DA SEMANA", info: "Exibindo a semana atual" };
    }

    if (periodo === "tudo") {
        return { inicio: null, fim: null, rotulo: "FATURAMENTO TOTAL", info: "Exibindo todo o histórico" };
    }

    if (periodo === "personalizado") {
        const inicioEl = document.getElementById("financeiroDataInicio");
        const fimEl = document.getElementById("financeiroDataFim");
        const inicio = inicioEl ? inicioEl.value : "";
        const fim = fimEl ? fimEl.value : "";
        if (inicio && fim && inicio <= fim) {
            return { inicio, fim, rotulo: "FATURAMENTO DO PERÍODO", info: `${formatarData(inicio)} até ${formatarData(fim)}` };
        }
        return obterIntervaloFinanceiro("mes");
    }

    const data = obterDataObjeto(hoje);
    const inicio = new Date(data.getFullYear(), data.getMonth(), 1);
    const fim = new Date(data.getFullYear(), data.getMonth() + 1, 0);
    return { inicio: formatarISODate(inicio), fim: formatarISODate(fim), rotulo: "FATURAMENTO DO MÊS", info: "Exibindo o mês atual" };
}

function formatarISODate(data) {
    return `${data.getFullYear()}-${String(data.getMonth()+1).padStart(2,"0")}-${String(data.getDate()).padStart(2,"0")}`;
}

function filtrarPeriodoFinanceiro(lista, periodo = financeiroPeriodoAtual) {
    const intervalo = obterIntervaloFinanceiro(periodo);
    if (!intervalo.inicio && !intervalo.fim) return lista;
    return lista.filter(item => {
        if (!item.data) return false;
        return item.data >= intervalo.inicio && item.data <= intervalo.fim;
    });
}

function configurarFiltrosFinanceiro() {
    document.querySelectorAll(".financeiro-filtro-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            financeiroPeriodoAtual = btn.dataset.periodo || "mes";
            document.querySelectorAll(".financeiro-filtro-btn").forEach(b => b.classList.remove("ativo"));
            btn.classList.add("ativo");
            renderizarFinanceiro();
        });
    });

    const aplicar = document.getElementById("aplicarPeriodoFinanceiro");
    if (aplicar) aplicar.addEventListener("click", () => {
        const inicio = document.getElementById("financeiroDataInicio")?.value;
        const fim = document.getElementById("financeiroDataFim")?.value;
        if (!inicio || !fim || inicio > fim) {
            alert("Informe um período válido.");
            return;
        }
        financeiroPeriodoAtual = "personalizado";
        document.querySelectorAll(".financeiro-filtro-btn").forEach(b => b.classList.remove("ativo"));
        renderizarFinanceiro();
    });
}

/* ==========================================================
   RENDERIZAR FINANCEIRO
========================================================== */

function renderizarFinanceiro() {

    const tela =
        document.getElementById(
            "telaFinanceiro"
        );

    if (!tela) {
        return;
    }

    const concluidos =
        obterAtendimentosConcluidos();

    const hoje = dataHojeISO();
    const intervalo = obterIntervaloFinanceiro(financeiroPeriodoAtual);
    const listaPeriodo = filtrarPeriodoFinanceiro(concluidos, financeiroPeriodoAtual);


    /* ------------------------------------------
       MÉTRICAS DO PERÍODO
    ------------------------------------------ */

    const faturamentoHoje = concluidos.filter(item => item.data === hoje)
        .reduce((total, item) => total + Number(item.valor || 0), 0);

    const faturamentoSemana = concluidos.filter(item => pertenceSemanaAtual(item.data))
        .reduce((total, item) => total + Number(item.valor || 0), 0);

    const faturamentoPeriodo = listaPeriodo.reduce(
        (total, item) => total + Number(item.valor || 0), 0
    );

    const totalAtendimentos = listaPeriodo.length;

    const ticketMedio = totalAtendimentos > 0
        ? faturamentoPeriodo / totalAtendimentos
        : 0;

    /* ------------------------------------------
       ATUALIZAR HTML
    ------------------------------------------ */

    const elementoHoje =
        document.getElementById(
            "faturamentoHoje"
        );

    const elementoSemana =
        document.getElementById(
            "faturamentoSemana"
        );

    const elementoMes =
        document.getElementById(
            "faturamentoMes"
        );

    const elementoAtendimentos =
        document.getElementById(
            "totalAtendimentosFinanceiro"
        );

    const elementoTicket =
        document.getElementById(
            "ticketMedio"
        );


    if (elementoHoje) {

        elementoHoje.textContent =
            formatarMoeda(
                faturamentoHoje
            );
    }

    if (elementoSemana) {

        elementoSemana.textContent =
            formatarMoeda(
                faturamentoSemana
            );
    }

    if (elementoMes) {
        elementoMes.textContent = formatarMoeda(faturamentoPeriodo);
    }

    if (elementoAtendimentos) {

        elementoAtendimentos.textContent =
            totalAtendimentos;
    }

    if (elementoTicket) {

        elementoTicket.textContent =
            formatarMoeda(
                ticketMedio
            );
    }


    renderizarServicosFinanceiro(listaPeriodo);
    renderizarHistoricoFinanceiro(listaPeriodo);

    const rotulo = document.getElementById("financeiroRotuloPeriodo");
    const info = document.getElementById("financeiroPeriodoInfo");
    if (rotulo) rotulo.textContent = intervalo.rotulo;
    if (info) info.textContent = intervalo.info;


    const vazio =
        document.getElementById(
            "estadoVazioFinanceiro"
        );

    if (vazio) {

        vazio.style.display =
            listaPeriodo.length === 0
                ? "block"
                : "none";
    }
}


/* ==========================================================
   SERVIÇOS DO FINANCEIRO
========================================================== */

function renderizarServicosFinanceiro(
    atendimentos
) {

    const lista =
        document.getElementById(
            "listaFinanceiroServicos"
        );

    if (!lista) {
        return;
    }

    if (!atendimentos.length) {

        lista.innerHTML = "";

        return;
    }


    const agrupados = {};


    atendimentos.forEach(item => {

        const nome =
            item.servico ||
            "Serviço";

        if (!agrupados[nome]) {

            agrupados[nome] = {

                quantidade: 0,

                total: 0

            };
        }

        agrupados[nome].quantidade++;

        agrupados[nome].total +=
            Number(item.valor || 0);
    });


    const servicos =
        Object.entries(
            agrupados
        )
        .sort(
            (a, b) =>
                b[1].quantidade -
                a[1].quantidade
        );


    lista.innerHTML =
        servicos.map(
            ([nome, dados]) => `

            <div class="financeiro-servico-item">

                <div class="financeiro-servico-info">

                    <div class="financeiro-servico-icone">
                        ✂
                    </div>

                    <div>

                        <strong>
                            ${escaparHTML(nome)}
                        </strong>

                        <span>
                            ${dados.quantidade}
                            ${
                                dados.quantidade === 1
                                    ? "atendimento"
                                    : "atendimentos"
                            }
                        </span>

                    </div>

                </div>

                <div class="financeiro-servico-total">

                    <strong>
                        ${formatarMoeda(
                            dados.total
                        )}
                    </strong>

                    <small>
                        faturado
                    </small>

                </div>

            </div>

            `
        )
        .join("");
}


/* ==========================================================
   HISTÓRICO FINANCEIRO
========================================================== */

function renderizarHistoricoFinanceiro(
    atendimentos
) {

    const lista =
        document.getElementById(
            "historicoFinanceiro"
        );

    if (!lista) {
        return;
    }

    const ordenados =
        [...atendimentos]
            .sort(
                (a, b) =>
                    `${b.data}${b.hora}`
                        .localeCompare(
                            `${a.data}${a.hora}`
                        )
            );


    if (!ordenados.length) {

        lista.innerHTML = "";

        return;
    }


    lista.innerHTML =
        ordenados.map(
            item => `

            <div class="financeiro-historico-item">

                <div class="financeiro-historico-info">

                    <strong>
                        ${escaparHTML(
                            item.cliente ||
                            "Cliente"
                        )}
                    </strong>

                    <span>
                        ${escaparHTML(
                            item.servico ||
                            "Serviço"
                        )}
                        ·
                        ${formatarData(
                            item.data
                        )}
                        ·
                        ${escaparHTML(
                            item.hora ||
                            "--:--"
                        )}
                    </span>

                </div>

                <strong
                    class="financeiro-historico-valor"
                >
                    ${formatarMoeda(
                        item.valor
                    )}
                </strong>

            </div>

            `
        )
        .join("");
}


configurarFiltrosFinanceiro();

/* ==========================================================
   RELATÓRIOS INTELIGENTES — ETAPA 9
========================================================== */
let relatorioPeriodoAtual = "mes";

function obterIntervaloRelatorio(periodo = relatorioPeriodoAtual) {
    const hoje = dataHojeISO();
    if (periodo === "hoje") return {inicio: hoje, fim: hoje, info: "Exibindo somente hoje"};
    if (periodo === "semana") {
        const h = obterDataObjeto(hoje), i = new Date(h);
        i.setDate(h.getDate() - h.getDay());
        const f = new Date(i); f.setDate(i.getDate()+6);
        return {inicio: formatarISODate(i), fim: formatarISODate(f), info: "Exibindo a semana atual"};
    }
    if (periodo === "tudo") return {inicio:null, fim:null, info:"Exibindo todo o histórico"};
    if (periodo === "personalizado") {
        const i=document.getElementById("relatorioDataInicio")?.value, f=document.getElementById("relatorioDataFim")?.value;
        if(i && f && i<=f) return {inicio:i,fim:f,info:`${formatarData(i)} até ${formatarData(f)}`};
    }
    const d=obterDataObjeto(hoje), i=new Date(d.getFullYear(),d.getMonth(),1), f=new Date(d.getFullYear(),d.getMonth()+1,0);
    return {inicio:formatarISODate(i),fim:formatarISODate(f),info:"Exibindo o mês atual"};
}

function filtrarRelatorio(lista) {
    const x=obterIntervaloRelatorio();
    if(!x.inicio) return lista;
    return lista.filter(a=>a.data && a.data>=x.inicio && a.data<=x.fim);
}

function agruparRelatorio(lista, campo) {
    const mapa={};
    lista.forEach(a=>{ const n=(a[campo]||"Não informado").trim() || "Não informado"; mapa[n]=(mapa[n]||0)+1; });
    return Object.entries(mapa).sort((a,b)=>b[1]-a[1]);
}

function renderizarRelatorios() {
    const tela=document.getElementById("telaRelatorios"); if(!tela) return;
    const todos=obterDados(CHAVES.agendamentos) || [];
    const intervalo=obterIntervaloRelatorio();
    const dentro=filtrarRelatorio(todos);
    const concluidos=dentro.filter(a=>normalizarStatus(a.status)==="concluido");
    const cancelados=dentro.filter(a=>normalizarStatus(a.status)==="cancelado");
    const faturamento=concluidos.reduce((s,a)=>s+Number(a.valor||0),0);
    const ticket=concluidos.length?faturamento/concluidos.length:0;
    document.getElementById("relatorioFaturamento").textContent=formatarMoeda(faturamento);
    document.getElementById("relatorioAtendimentos").textContent=concluidos.length;
    document.getElementById("relatorioTicket").textContent=formatarMoeda(ticket);
    document.getElementById("relatorioCancelamentos").textContent=cancelados.length;
    document.getElementById("relatorioPeriodoInfo").textContent=intervalo.info;

    const servicos=agruparRelatorio(concluidos,"servico").slice(0,8);
    document.getElementById("relatorioServicos").innerHTML=servicos.length ? servicos.map(([n,q],i)=>`<div class="relatorio-item"><span class="relatorio-posicao">${i+1}</span><strong>${escaparHTML(n)}</strong><b>${q} ${q===1?"atendimento":"atendimentos"}</b></div>`).join("") : '<div class="relatorio-vazio">Nenhum atendimento concluído no período.</div>';
    const clientes=agruparRelatorio(concluidos,"cliente").slice(0,8);
    document.getElementById("relatorioClientes").innerHTML=clientes.length ? clientes.map(([n,q],i)=>`<div class="relatorio-item"><span class="relatorio-posicao">${i+1}</span><strong>${escaparHTML(n)}</strong><b>${q} ${q===1?"atendimento":"atendimentos"}</b></div>`).join("") : '<div class="relatorio-vazio">Nenhum cliente com atendimento concluído no período.</div>';

    const porMes={};
    concluidos.forEach(a=>{const chave=(a.data||"").slice(0,7); if(chave) porMes[chave]=(porMes[chave]||0)+Number(a.valor||0);});
    const evolucao=Object.entries(porMes).sort((a,b)=>a[0].localeCompare(b[0])).slice(-6);
    const max=Math.max(...evolucao.map(x=>x[1]),1);
    document.getElementById("relatorioEvolucao").innerHTML=evolucao.length ? evolucao.map(([m,v])=>`<div class="evolucao-linha"><span>${m.split("-").reverse().join("/")}</span><div><i style="width:${Math.max(4,(v/max)*100)}%"></i></div><strong>${formatarMoeda(v)}</strong></div>`).join("") : '<div class="relatorio-vazio">Ainda não há dados para mostrar a evolução.</div>';
}

function configurarRelatorios() {
    document.querySelectorAll("[data-relatorio-periodo]").forEach(btn=>btn.addEventListener("click",()=>{
        relatorioPeriodoAtual=btn.dataset.relatorioPeriodo||"mes";
        document.querySelectorAll("[data-relatorio-periodo]").forEach(b=>b.classList.remove("ativo")); btn.classList.add("ativo"); renderizarRelatorios();
    }));
    document.getElementById("aplicarPeriodoRelatorio")?.addEventListener("click",()=>{
        const i=document.getElementById("relatorioDataInicio")?.value, f=document.getElementById("relatorioDataFim")?.value;
        if(!i||!f||i>f){alert("Informe um período válido.");return;} relatorioPeriodoAtual="personalizado"; document.querySelectorAll("[data-relatorio-periodo]").forEach(b=>b.classList.remove("ativo")); renderizarRelatorios();
    });
    document.getElementById("imprimirRelatorio")?.addEventListener("click",()=>window.print());
    document.getElementById("exportarRelatorio")?.addEventListener("click",()=>{
        const todos=obterDados(CHAVES.agendamentos)||[], dentro=filtrarRelatorio(todos), concluidos=dentro.filter(a=>normalizarStatus(a.status)==="concluido");
        const linhas=[["Data","Hora","Cliente","Serviço","Valor","Status"],...dentro.map(a=>[a.data||"",a.hora||"",a.cliente||"",a.servico||"",Number(a.valor||0).toFixed(2).replace(".",","),a.status||""])];
        const csv="\ufeff"+linhas.map(l=>l.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(";")).join("\n");
        const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}), url=URL.createObjectURL(blob), a=document.createElement("a"); a.href=url; a.download=`BARBER-RD-relatorio-${dataHojeISO()}.csv`; a.click(); URL.revokeObjectURL(url);
    });
}
configurarRelatorios();

/* ==========================================================
   NAVEGAÇÃO
========================================================== */

document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const destino =
                    item.dataset.tela;

                if (
                    destino === "mais"
                ) {

                    renderizarFinanceiro();

                    mostrarTela(
                        "financeiro"
                    );

                    return;
                }


                if (
                    destino === "agenda"
                ) {

                    renderizarCalendario();

                    renderizarAgenda();
                }


                if (
                    destino === "clientes"
                ) {

                    renderizarClientes();
                }


                if (
                    destino === "servicos"
                ) {

                    renderizarServicos();
                }


                if (
                    destino === "financeiro"
                ) {

                    renderizarFinanceiro();
                }


                mostrarTela(
                    destino
                );
            }
        );
    });


/* ==========================================================
   HOME — NOVO AGENDAMENTO
========================================================== */

const btnInicioAgendamento =
    document.getElementById(
        "btnInicioAgendamento"
    );

if (btnInicioAgendamento) {

    btnInicioAgendamento
        .addEventListener(
            "click",
            abrirNovoAgendamento
        );
}


/* ==========================================================
   HOME — NOVO CLIENTE
========================================================== */

const btnInicioCliente =
    document.getElementById(
        "btnInicioCliente"
    );

if (btnInicioCliente) {

    btnInicioCliente
        .addEventListener(
            "click",
            abrirNovoCliente
        );
}


/* ==========================================================
   HOME — SERVIÇOS
========================================================== */

const btnInicioServicos =
    document.getElementById(
        "btnInicioServicos"
    );

if (btnInicioServicos) {

    btnInicioServicos
        .addEventListener(
            "click",
            () => {

                renderizarServicos();

                mostrarTela(
                    "servicos"
                );
            }
        );
}


/* ==========================================================
   HOME — FINANCEIRO
========================================================== */

const btnInicioRelatorios =
    document.getElementById(
        "btnInicioRelatorios"
    );

if (btnInicioRelatorios) {

    btnInicioRelatorios
        .addEventListener(
            "click",
            () => {

                renderizarFinanceiro();

                mostrarTela(
                    "financeiro"
                );
            }
        );
}


/* ==========================================================
   HOME — VER AGENDA
========================================================== */

const btnVerAgenda =
    document.getElementById(
        "btnVerAgenda"
    );

if (btnVerAgenda) {

    btnVerAgenda
        .addEventListener(
            "click",
            () => {

                irParaHoje();

                mostrarTela(
                    "agenda"
                );
            }
        );
}


/* ==========================================================
   HOME — NOVO AGENDAMENTO
========================================================== */

const btnNovoAgendamento =
    document.getElementById(
        "btnNovoAgendamento"
    );

if (btnNovoAgendamento) {

    btnNovoAgendamento
        .addEventListener(
            "click",
            abrirNovoAgendamento
        );
}


/* ==========================================================
   AGENDA — BOTÃO +
========================================================== */

const btnAdicionarAgendamento =
    document.getElementById(
        "btnAdicionarAgendamento"
    );

if (btnAdicionarAgendamento) {

    btnAdicionarAgendamento
        .addEventListener(
            "click",
            abrirNovoAgendamento
        );
}


/* ==========================================================
   AGENDA — NOVO
========================================================== */

const btnNovoAgendamentoAgenda =
    document.getElementById(
        "btnNovoAgendamentoAgenda"
    );

if (btnNovoAgendamentoAgenda) {

    btnNovoAgendamentoAgenda
        .addEventListener(
            "click",
            abrirNovoAgendamento
        );
}


/* ==========================================================
   AGENDA — MÊS
========================================================== */

const btnMesAnterior =
    document.getElementById(
        "btnMesAnterior"
    );

if (btnMesAnterior) {

    btnMesAnterior
        .addEventListener(
            "click",
            mesAnterior
        );
}


const btnMesProximo =
    document.getElementById(
        "btnMesProximo"
    );

if (btnMesProximo) {

    btnMesProximo
        .addEventListener(
            "click",
            mesProximo
        );
}


/* ==========================================================
   AGENDA — HOJE
========================================================== */

const btnHojeAgenda =
    document.getElementById(
        "btnHojeAgenda"
    );

if (btnHojeAgenda) {

    btnHojeAgenda
        .addEventListener(
            "click",
            irParaHoje
        );
}


/* ==========================================================
   VOLTAR AGENDA
========================================================== */

const voltarAgenda =
    document.getElementById(
        "voltarAgenda"
    );

if (voltarAgenda) {

    voltarAgenda
        .addEventListener(
            "click",
            () =>
                mostrarTela("inicio")
        );
}


/* ==========================================================
   VOLTAR FINANCEIRO
========================================================== */

const voltarFinanceiro =
    document.getElementById(
        "voltarFinanceiro"
    );

if (voltarFinanceiro) {

    voltarFinanceiro
        .addEventListener(
            "click",
            () =>
                mostrarTela("inicio")
        );
}

const voltarRelatorios = document.getElementById("voltarRelatorios");
if (voltarRelatorios) {
    voltarRelatorios.addEventListener("click", () => mostrarTela("inicio"));
}


/* ==========================================================
   FORMULÁRIO DE AGENDAMENTO
========================================================== */

const formAgendamento =
    document.getElementById(
        "formAgendamento"
    );

if (formAgendamento) {

    formAgendamento
        .addEventListener(
            "submit",
            salvarAgendamento
        );
}


/* ==========================================================
   CLIENTE — SUGESTÕES
========================================================== */

const clienteNome =
    document.getElementById(
        "clienteNome"
    );

if (clienteNome) {

    clienteNome
        .addEventListener(
            "focus",
            atualizarSugestoesClientes
        );
}


/* ==========================================================
   SERVIÇO → PREÇO AUTOMÁTICO
========================================================== */

const servicoSelect =
    document.getElementById(
        "servico"
    );

if (servicoSelect) {

    servicoSelect
        .addEventListener(
            "change",
            () => {

                const opcao =
                    servicoSelect
                        .options[
                            servicoSelect
                                .selectedIndex
                        ];

                const valor =
                    document.getElementById(
                        "valor"
                    );

                if (
                    valor &&
                    opcao &&
                    opcao.dataset.preco
                ) {

                    valor.value =
                        Number(
                            opcao.dataset.preco
                        ).toFixed(2);
                }
            }
        );
}


/* ==========================================================
   VOLTAR NOVO AGENDAMENTO
========================================================== */

const voltarNovoAgendamento =
    document.getElementById(
        "voltarNovoAgendamento"
    );

if (voltarNovoAgendamento) {

    voltarNovoAgendamento
        .addEventListener(
            "click",
            () =>
                mostrarTela("agenda")
        );
}


/* ==========================================================
   DETALHES — VOLTAR
========================================================== */

const voltarDetalhes =
    document.getElementById(
        "voltarDetalhesAgendamento"
    );

if (voltarDetalhes) {

    voltarDetalhes
        .addEventListener(
            "click",
            () => {

                renderizarAgenda();

                mostrarTela(
                    "agenda"
                );
            }
        );
}


/* ==========================================================
   INICIAR ATENDIMENTO
========================================================== */

const btnIniciar =
    document.getElementById(
        "btnIniciarAtendimento"
    );

if (btnIniciar) {

    btnIniciar
        .addEventListener(
            "click",
            () =>
                alterarStatusAgendamento(
                    "atendimento"
                )
        );
}


/* ==========================================================
   CONCLUIR ATENDIMENTO
========================================================== */

const btnConcluir =
    document.getElementById(
        "btnConcluirAtendimento"
    );

if (btnConcluir) {

    btnConcluir
        .addEventListener(
            "click",
            () =>
                alterarStatusAgendamento(
                    "concluido"
                )
        );
}


/* ==========================================================
   CANCELAR ATENDIMENTO
========================================================== */

const btnCancelar =
    document.getElementById(
        "btnCancelarAtendimento"
    );

if (btnCancelar) {

    btnCancelar
        .addEventListener(
            "click",
            () => {

                if (
                    !confirm(
                        "Cancelar este atendimento?"
                    )
                ) {
                    return;
                }

                alterarStatusAgendamento(
                    "cancelado"
                );
            }
        );
}


/* ==========================================================
   CLIENTES — BUSCA
========================================================== */

const buscaCliente =
    document.getElementById(
        "buscaCliente"
    );

if (buscaCliente) {

    buscaCliente
        .addEventListener(
            "input",
            () =>
                renderizarClientes(
                    buscaCliente.value
                )
        );
}


/* ==========================================================
   CLIENTES — ADICIONAR
========================================================== */

const btnAdicionarCliente =
    document.getElementById(
        "btnAdicionarCliente"
    );

if (btnAdicionarCliente) {

    btnAdicionarCliente
        .addEventListener(
            "click",
            abrirNovoCliente
        );
}


const btnCadastrarPrimeiroCliente =
    document.getElementById(
        "btnCadastrarPrimeiroCliente"
    );

if (btnCadastrarPrimeiroCliente) {

    btnCadastrarPrimeiroCliente
        .addEventListener(
            "click",
            abrirNovoCliente
        );
}


/* ==========================================================
   CLIENTES — FORM
========================================================== */

const formCliente =
    document.getElementById(
        "formCliente"
    );

if (formCliente) {

    formCliente
        .addEventListener(
            "submit",
            salvarCliente
        );
}


/* ==========================================================
   CLIENTES — VOLTAR
========================================================== */

const voltarClientes =
    document.getElementById(
        "voltarClientes"
    );

if (voltarClientes) {

    voltarClientes
        .addEventListener(
            "click",
            () =>
                mostrarTela("inicio")
        );
}


const voltarNovoCliente =
    document.getElementById(
        "voltarNovoCliente"
    );

if (voltarNovoCliente) {

    voltarNovoCliente
        .addEventListener(
            "click",
            () =>
                mostrarTela("clientes")
        );
}


const voltarFichaCliente =
    document.getElementById(
        "voltarFichaCliente"
    );

if (voltarFichaCliente) {

    voltarFichaCliente
        .addEventListener(
            "click",
            () => {

                clienteFichaAtual =
                    null;

                renderizarClientes();

                mostrarTela(
                    "clientes"
                );
            }
        );
}


/* ==========================================================
   EDITAR CLIENTE
========================================================== */

const btnEditarCliente =
    document.getElementById(
        "btnEditarCliente"
    );

if (btnEditarCliente) {

    btnEditarCliente
        .addEventListener(
            "click",
            editarClienteAtual
        );
}


/* ==========================================================
   EXCLUIR CLIENTE
========================================================== */

const btnExcluirCliente =
    document.getElementById(
        "btnExcluirCliente"
    );

if (btnExcluirCliente) {

    btnExcluirCliente
        .addEventListener(
            "click",
            excluirClienteAtual
        );
}


/* ==========================================================
   WHATSAPP
========================================================== */

const btnWhatsAppCliente =
    document.getElementById(
        "btnWhatsAppCliente"
    );

if (btnWhatsAppCliente) {

    btnWhatsAppCliente
        .addEventListener(
            "click",
            abrirWhatsAppCliente
        );
}


/* ==========================================================
   SERVIÇOS — BOTÕES
========================================================== */

const btnAdicionarServico =
    document.getElementById(
        "btnAdicionarServico"
    );

if (btnAdicionarServico) {

    btnAdicionarServico
        .addEventListener(
            "click",
            abrirNovoServico
        );
}


const btnCadastrarPrimeiroServico =
    document.getElementById(
        "btnCadastrarPrimeiroServico"
    );

if (btnCadastrarPrimeiroServico) {

    btnCadastrarPrimeiroServico
        .addEventListener(
            "click",
            abrirNovoServico
        );
}


/* ==========================================================
   SERVIÇOS — BUSCA E FILTROS
========================================================== */

const buscaServicos = document.getElementById("buscaServicos");
if (buscaServicos) {
    buscaServicos.addEventListener("input", () => renderizarServicos());
}

document.querySelectorAll("[data-filtro-servico]").forEach(botao => {
    botao.addEventListener("click", () => {
        document.querySelectorAll("[data-filtro-servico]").forEach(item => item.classList.remove("ativo"));
        botao.classList.add("ativo");
        renderizarServicos();
    });
});


/* ==========================================================
   SERVIÇOS — VOLTAR
========================================================== */

const voltarServicos =
    document.getElementById(
        "voltarServicos"
    );

if (voltarServicos) {

    voltarServicos
        .addEventListener(
            "click",
            () =>
                mostrarTela("inicio")
        );
}


const voltarNovoServico =
    document.getElementById(
        "voltarNovoServico"
    );

if (voltarNovoServico) {

    voltarNovoServico
        .addEventListener(
            "click",
            () =>
                mostrarTela("servicos")
        );
}


/* ==========================================================
   FORMULÁRIO DE SERVIÇO
========================================================== */

const formServico =
    document.getElementById(
        "formServico"
    );

if (formServico) {

    formServico
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const nome =
                    document.getElementById(
                        "novoServicoNome"
                    );

                const preco =
                    document.getElementById(
                        "novoServicoPreco"
                    );

                const duracao =
                    document.getElementById(
                        "novoServicoDuracao"
                    );

                const ativo =
                    document.getElementById(
                        "novoServicoAtivo"
                    );

                if (
                    !nome ||
                    !nome.value.trim()
                ) {

                    mostrarMensagem(
                        "Digite o nome do serviço."
                    );

                    return;
                }

                const servicos =
                    obterDados(
                        CHAVES.servicos
                    );

                const nomeNormalizado = nome.value.trim().toLowerCase();
                const precoValor = Number(preco?.value || 0);
                let duracaoValor = Number(duracao?.value || 0);

                if (!duracaoValor) {
                    try {
                        const configAtual = JSON.parse(localStorage.getItem(CONFIG_CHAVE) || "{}");
                        duracaoValor = Number(configAtual.duracaoPadrao || 30);
                        if (duracao) duracao.value = String(duracaoValor);
                    } catch (_) {
                        duracaoValor = 30;
                    }
                }

                if (precoValor < 0 || duracaoValor <= 0) {
                    mostrarMensagem("Informe preço e duração válidos.");
                    return;
                }

                const editando =
                    formServico
                        .dataset
                        .editando;

                const duplicado = servicos.find(item =>
                    String(item.id) !== String(editando || "") &&
                    String(item.nome || "").trim().toLowerCase() === nomeNormalizado
                );

                if (duplicado) {
                    mostrarMensagem("Já existe um serviço com esse nome.");
                    return;
                }


                if (editando) {

                    const index =
                        servicos.findIndex(
                            item =>
                                String(
                                    item.id
                                ) ===
                                String(
                                    editando
                                )
                        );

                    if (
                        index === -1
                    ) {

                        mostrarMensagem(
                            "Serviço não encontrado."
                        );

                        return;
                    }

                    servicos[index].nome =
                        nome.value.trim();

                    servicos[index].preco = precoValor;
                    servicos[index].duracao = duracaoValor;

                    servicos[index].ativo =
                        ativo
                            ? ativo.checked
                            : true;

                    mostrarMensagem(
                        "Serviço atualizado."
                    );

                } else {

                    servicos.push({

                        id:
                            gerarId(),

                        nome:
                            nome.value.trim(),

                        preco: precoValor,
                        duracao: duracaoValor,

                        ativo:
                            ativo
                                ? ativo.checked
                                : true,

                        criadoEm:
                            new Date()
                                .toISOString()

                    });

                    mostrarMensagem(
                        "Serviço cadastrado."
                    );
                }


                if (
                    !salvarDados(
                        CHAVES.servicos,
                        servicos
                    )
                ) {
                    return;
                }

                delete formServico
                    .dataset
                    .editando;

                renderizarServicos();

                atualizarSelectServicos();

                mostrarTela(
                    "servicos"
                );
            }
        );
}


/* ==========================================================
   MENU
========================================================== */

/* =====================================================
   MENU LATERAL
   ===================================================== */

const menuLateral = document.getElementById("menuLateral");
const menuOverlay = document.getElementById("menuOverlay");
const btnMenu = document.getElementById("btnMenu");
const btnFecharMenu = document.getElementById("btnFecharMenu");


function abrirMenu() {

    if (!menuLateral || !menuOverlay) return;

    menuLateral.classList.add("ativo");
    menuOverlay.classList.add("ativo");

    document.body.classList.add("menu-aberto");
}


function fecharMenu() {

    if (!menuLateral || !menuOverlay) return;

    menuLateral.classList.remove("ativo");
    menuOverlay.classList.remove("ativo");

    document.body.classList.remove("menu-aberto");
}


/* BOTÃO HAMBÚRGUER */

if (btnMenu) {

    btnMenu.addEventListener("click", function () {

        abrirMenu();

    });

}


/* BOTÃO X */

if (btnFecharMenu) {

    btnFecharMenu.addEventListener("click", function () {

        fecharMenu();

    });

}


/* CLICAR FORA */

if (menuOverlay) {

    menuOverlay.addEventListener("click", function () {

        fecharMenu();

    });

}


/* ITENS DO MENU */

document.querySelectorAll(".menu-item").forEach(function (item) {

    item.addEventListener("click", function () {

        const tela =
            item.dataset.menuTela;

        if (!tela) {
            return;
        }

        fecharMenu();


        setTimeout(function () {

            /* ==============================
               AGENDA
            ============================== */

            if (tela === "agenda") {

                renderizarCalendario();

                renderizarAgenda();
            }


            /* ==============================
               CLIENTES
            ============================== */

            if (tela === "clientes") {

                renderizarClientes();
            }


            /* ==============================
               SERVIÇOS
            ============================== */

            if (tela === "servicos") {

                renderizarServicos();
            }


            /* ==============================
               FINANCEIRO
            ============================== */

            if (tela === "financeiro") {

                renderizarFinanceiro();
            }

            if (tela === "relatorios") {

                renderizarRelatorios();
            }


            mostrarTela(tela);

        }, 150);

    });

});
/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

function iniciarBarberPro() {

    console.log(
        "================================"
    );

    console.log(
        "BARBER R.D INICIANDO..."
    );

    console.log(
        "================================"
    );


    if (!testarArmazenamento()) {

        console.error(
            "LocalStorage não disponível."
        );

        mostrarMensagem(
            "Atenção: armazenamento indisponível."
        );
    }


    criarServicosPadrao();

    atualizarSelectServicos();

    atualizarSugestoesClientes();

    renderizarCalendario();

    renderizarAgenda();

    renderizarClientes();

    renderizarServicos();

    atualizarResumoHome();

    renderizarFinanceiro();

    mostrarTela(
        "inicio"
    );


    console.log(
        "Agendamentos:",
        obterDados(
            CHAVES.agendamentos
        )
    );

    console.log(
        "Clientes:",
        obterDados(
            CHAVES.clientes
        )
    );

    console.log(
        "Serviços:",
        obterDados(
            CHAVES.servicos
        )
    );

    console.log(
        "BARBER R.D pronto."
    );
}


/* ==========================================================
   INICIAR
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarBarberPro
    );

} else {

    iniciarBarberPro();
}
/* =========================================
   CONFIGURAÇÕES DA BARBEARIA
========================================= */

const CONFIG_CHAVE = "barberpro_configuracoes";


/* =========================================
   HORÁRIOS PADRÃO
========================================= */

const HORARIOS_PADRAO = {

    segunda: {
        nome: "Segunda-feira",
        aberto: true,
        abertura: "08:00",
        inicioIntervalo: "13:00",
        fimIntervalo: "15:00",
        fechamento: "18:00"
    },

    terca: {
        nome: "Terça-feira",
        aberto: true,
        abertura: "08:00",
        inicioIntervalo: "13:00",
        fimIntervalo: "15:00",
        fechamento: "18:00"
    },

    quarta: {
        nome: "Quarta-feira",
        aberto: true,
        abertura: "08:00",
        inicioIntervalo: "13:00",
        fimIntervalo: "15:00",
        fechamento: "18:00"
    },

    quinta: {
        nome: "Quinta-feira",
        aberto: true,
        abertura: "08:00",
        inicioIntervalo: "13:00",
        fimIntervalo: "15:00",
        fechamento: "18:00"
    },

    sexta: {
        nome: "Sexta-feira",
        aberto: true,
        abertura: "08:00",
        inicioIntervalo: "13:00",
        fimIntervalo: "15:00",
        fechamento: "18:00"
    },

    sabado: {
        nome: "Sábado",
        aberto: true,
        abertura: "08:00",
        inicioIntervalo: "",
        fimIntervalo: "",
        fechamento: "14:00"
    },

    domingo: {
        nome: "Domingo",
        aberto: false,
        abertura: "08:00",
        inicioIntervalo: "",
        fimIntervalo: "",
        fechamento: "12:00"
    }

};


/* =========================================
   CARREGAR CONFIGURAÇÕES
========================================= */

function carregarConfiguracoes() {

    let configuracoes = {};

    try {

        const dadosSalvos =
            localStorage.getItem(CONFIG_CHAVE);

        if (dadosSalvos) {

            configuracoes =
                JSON.parse(dadosSalvos);
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar configurações:",
            erro
        );

        configuracoes = {};
    }


    /* -----------------------------------------
       PERFIL
    ----------------------------------------- */

    const nomeBarbearia =
        document.getElementById(
            "configNomeBarbearia"
        );

    const nomeBarbeiro =
        document.getElementById(
            "configNomeBarbeiro"
        );

    const whatsapp =
        document.getElementById(
            "configWhatsApp"
        );

    const endereco =
        document.getElementById(
            "configEndereco"
        );


    if (nomeBarbearia) {

        nomeBarbearia.value =
            configuracoes.nomeBarbearia || "";
    }

    if (nomeBarbeiro) {

        nomeBarbeiro.value =
            configuracoes.nomeBarbeiro || "";
    }

    if (whatsapp) {

        whatsapp.value =
            configuracoes.whatsapp || "";
    }

    if (endereco) {

        endereco.value =
            configuracoes.endereco || "";
    }


    /* -----------------------------------------
       PREFERÊNCIAS
    ----------------------------------------- */

    const duracaoPadrao =
        document.getElementById("configDuracaoPadrao");

    const atualizacaoAutomatica =
        document.getElementById("configAtualizacaoAutomatica");

    if (duracaoPadrao) {
        duracaoPadrao.value =
            String(configuracoes.duracaoPadrao || 30);
    }

    if (atualizacaoAutomatica) {
        atualizacaoAutomatica.checked =
            configuracoes.atualizacaoAutomatica !== false;
    }


    /* -----------------------------------------
       HORÁRIOS
    ----------------------------------------- */

    const horarios =
        configuracoes.horarios || {};


    Object.keys(HORARIOS_PADRAO)
        .forEach(function(dia) {

            const padrao =
                HORARIOS_PADRAO[dia];

            const salvo =
                horarios[dia] || {};


            const checkbox =
                document.querySelector(
                    '.dia-aberto[data-dia="' +
                    dia +
                    '"]'
                );

            const abertura =
                document.querySelector(
                    '.hora-abertura[data-dia="' +
                    dia +
                    '"]'
                );

            const inicioIntervalo =
                document.querySelector(
                    '.hora-inicio-intervalo[data-dia="' +
                    dia +
                    '"]'
                );

            const fimIntervalo =
                document.querySelector(
                    '.hora-fim-intervalo[data-dia="' +
                    dia +
                    '"]'
                );

            const fechamento =
                document.querySelector(
                    '.hora-fechamento[data-dia="' +
                    dia +
                    '"]'
                );


            if (checkbox) {

                checkbox.checked =
                    salvo.aberto !== undefined
                        ? salvo.aberto
                        : padrao.aberto;
            }


            if (abertura) {

                abertura.value =
                    salvo.abertura ||
                    padrao.abertura;
            }


            if (inicioIntervalo) {

                inicioIntervalo.value =
                    salvo.inicioIntervalo ||
                    padrao.inicioIntervalo;
            }


            if (fimIntervalo) {

                fimIntervalo.value =
                    salvo.fimIntervalo ||
                    padrao.fimIntervalo;
            }


            if (fechamento) {

                fechamento.value =
                    salvo.fechamento ||
                    padrao.fechamento;
            }


            atualizarVisualHorario(dia);

        });
}


/* =========================================
   VISUAL ABERTO / FECHADO
========================================= */

function atualizarVisualHorario(dia) {

    const checkbox =
        document.querySelector(
            '.dia-aberto[data-dia="' +
            dia +
            '"]'
        );

    if (!checkbox) {
        return;
    }


    const bloco =
        checkbox.closest(
            ".horario-dia"
        );

    if (!bloco) {
        return;
    }


    if (checkbox.checked) {

        bloco.classList.remove(
            "fechado"
        );

    } else {

        bloco.classList.add(
            "fechado"
        );
    }
}


/* =========================================
   EVENTOS DOS DIAS
========================================= */

document
    .querySelectorAll(".dia-aberto")
    .forEach(function(checkbox) {

        checkbox.addEventListener(
            "change",
            function() {

                atualizarVisualHorario(
                    checkbox.dataset.dia
                );

            }
        );

    });


/* =========================================
   SALVAR CONFIGURAÇÕES
========================================= */

function salvarConfiguracoes(event) {

    if (event) {

        event.preventDefault();
        event.stopPropagation();
    }


    try {

        const configuracoes = {};


        /* -------------------------------------
           PERFIL
        ------------------------------------- */

        const nomeBarbearia =
            document.getElementById(
                "configNomeBarbearia"
            );

        const nomeBarbeiro =
            document.getElementById(
                "configNomeBarbeiro"
            );

        const whatsapp =
            document.getElementById(
                "configWhatsApp"
            );

        const endereco =
            document.getElementById(
                "configEndereco"
            );


        configuracoes.nomeBarbearia =
            nomeBarbearia
                ? nomeBarbearia.value.trim()
                : "";

        configuracoes.nomeBarbeiro =
            nomeBarbeiro
                ? nomeBarbeiro.value.trim()
                : "";

        configuracoes.whatsapp =
            whatsapp
                ? whatsapp.value.trim()
                : "";

        configuracoes.endereco =
            endereco
                ? endereco.value.trim()
                : "";


        /* -------------------------------------
           HORÁRIOS
        ------------------------------------- */

        configuracoes.horarios = {};


        Object.keys(HORARIOS_PADRAO)
            .forEach(function(dia) {

                const padrao =
                    HORARIOS_PADRAO[dia];


                const checkbox =
                    document.querySelector(
                        '.dia-aberto[data-dia="' +
                        dia +
                        '"]'
                    );

                const abertura =
                    document.querySelector(
                        '.hora-abertura[data-dia="' +
                        dia +
                        '"]'
                    );

                const inicioIntervalo =
                    document.querySelector(
                        '.hora-inicio-intervalo[data-dia="' +
                        dia +
                        '"]'
                    );

                const fimIntervalo =
                    document.querySelector(
                        '.hora-fim-intervalo[data-dia="' +
                        dia +
                        '"]'
                    );

                const fechamento =
                    document.querySelector(
                        '.hora-fechamento[data-dia="' +
                        dia +
                        '"]'
                    );


                configuracoes.horarios[dia] = {

                    nome:
                        padrao.nome,

                    aberto:
                        checkbox
                            ? checkbox.checked
                            : padrao.aberto,

                    abertura:
                        abertura
                            ? abertura.value
                            : padrao.abertura,

                    inicioIntervalo:
                        inicioIntervalo
                            ? inicioIntervalo.value
                            : padrao.inicioIntervalo,

                    fimIntervalo:
                        fimIntervalo
                            ? fimIntervalo.value
                            : padrao.fimIntervalo,

                    fechamento:
                        fechamento
                            ? fechamento.value
                            : padrao.fechamento

                };

            });


        /* -------------------------------------
           VALIDAR HORÁRIOS
        ------------------------------------- */

        const minutos = valor => {
            if (!valor) return null;
            const partes = String(valor).split(":");
            if (partes.length !== 2) return null;
            return Number(partes[0]) * 60 + Number(partes[1]);
        };

        for (const dia of Object.keys(configuracoes.horarios)) {
            const h = configuracoes.horarios[dia];
            if (!h.aberto) continue;

            const aberturaMin = minutos(h.abertura);
            const fechamentoMin = minutos(h.fechamento);
            const inicioInt = minutos(h.inicioIntervalo);
            const fimInt = minutos(h.fimIntervalo);

            if (aberturaMin === null || fechamentoMin === null || fechamentoMin <= aberturaMin) {
                mostrarMensagem(`Horário inválido em ${h.nome}.`);
                return;
            }

            const temInicio = inicioInt !== null;
            const temFim = fimInt !== null;

            if (temInicio !== temFim) {
                mostrarMensagem(`Preencha o intervalo completo em ${h.nome}.`);
                return;
            }

            if (temInicio && (fimInt <= inicioInt || inicioInt <= aberturaMin || fimInt >= fechamentoMin)) {
                mostrarMensagem(`Intervalo inválido em ${h.nome}.`);
                return;
            }
        }

        /* -------------------------------------
           PREFERÊNCIAS
        ------------------------------------- */

        const duracaoPadrao =
            document.getElementById("configDuracaoPadrao");

        const atualizacaoAutomatica =
            document.getElementById("configAtualizacaoAutomatica");

        configuracoes.duracaoPadrao =
            Number(duracaoPadrao?.value || 30);

        configuracoes.atualizacaoAutomatica =
            atualizacaoAutomatica
                ? atualizacaoAutomatica.checked
                : true;


        /* -------------------------------------
           SALVAR
        ------------------------------------- */

        localStorage.setItem(
            CONFIG_CHAVE,
            JSON.stringify(
                configuracoes
            )
        );


        /* -------------------------------------
           CONFERIR SE REALMENTE GRAVOU
        ------------------------------------- */

        const conferencia =
            localStorage.getItem(
                CONFIG_CHAVE
            );


        if (!conferencia) {

            throw new Error(
                "Configurações não foram gravadas."
            );
        }


        console.log(
            "BARBER R.D - CONFIGURAÇÕES SALVAS:",
            configuracoes
        );


        /* -------------------------------------
           STATUS
        ------------------------------------- */

        const status =
            document.getElementById(
                "configStatus"
            );

        if (status) {

            status.textContent =
                "✓ Configurações salvas com sucesso!";

            status.style.color =
                "#4d8b5c";
        }


        mostrarMensagem(
            "Configurações salvas!"
        );


        setTimeout(function() {

            if (status) {

                status.textContent = "";
            }

        }, 3000);


    } catch (erro) {

        console.error(
            "BARBER R.D - ERRO AO SALVAR CONFIGURAÇÕES:",
            erro
        );


        mostrarMensagem(
            "Erro ao salvar configurações."
        );
    }
}


/* =========================================
   BOTÃO SALVAR
========================================= */

const btnSalvarConfiguracoes =
    document.getElementById(
        "btnSalvarConfiguracoes"
    );


if (btnSalvarConfiguracoes) {

    btnSalvarConfiguracoes.type =
        "button";


    btnSalvarConfiguracoes.addEventListener(
        "click",
        salvarConfiguracoes
    );

}


/* =========================================
   VOLTAR CONFIGURAÇÕES
========================================= */

const voltarConfiguracoes =
    document.getElementById(
        "voltarConfiguracoes"
    );


if (voltarConfiguracoes) {

    voltarConfiguracoes.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            mostrarTela(
                "inicio"
            );

        }
    );

}


/* =========================================
   CARREGAR CONFIGURAÇÕES
========================================= */

carregarConfiguracoes();

/* ==========================================================
   BACKUP E RESTAURAÇÃO — BARBER R.D
========================================================== */


/* ==========================================================
   OBTER DADOS DO BARBER R.D
========================================================== */

function obterDadosBackupBarberPro() {

    const dados = {};

    for (let i = 0; i < localStorage.length; i++) {

        const chave = localStorage.key(i);

        if (
            chave &&
            chave.startsWith("barberpro_")
        ) {

            try {

                const valor =
                    localStorage.getItem(chave);

                dados[chave] =
                    JSON.parse(valor);

            } catch (erro) {

                dados[chave] =
                    localStorage.getItem(chave);

            }

        }

    }

    return dados;
}


/* ==========================================================
   FAZER BACKUP + COMPARTILHAR
========================================================== */

async function fazerBackupBarberPro() {

    try {

        const dados = obterDadosBackupBarberPro();

        const contagem = {
            agendamentos: Array.isArray(dados.barberpro_agendamentos) ? dados.barberpro_agendamentos.length : 0,
            clientes: Array.isArray(dados.barberpro_clientes) ? dados.barberpro_clientes.length : 0,
            servicos: Array.isArray(dados.barberpro_servicos) ? dados.barberpro_servicos.length : 0,
            configuracoes: dados.barberpro_configuracoes ? 1 : 0
        };

        const agora = new Date();
        const dataLocal = agora.toLocaleString("pt-BR");

        const backup = {
            aplicativo: "BARBER R.D",
            identificador: "barber-rd-backup",
            versaoBackup: "2.0",
            dataBackup: agora.toISOString(),
            dataBackupLocal: dataLocal,
            resumo: contagem,
            dados: dados
        };

        const conteudo = JSON.stringify(backup, null, 2);
        const arquivo = new Blob([conteudo], { type: "application/json" });

        const ano = String(agora.getFullYear());
        const mes = String(agora.getMonth() + 1).padStart(2, "0");
        const dia = String(agora.getDate()).padStart(2, "0");
        const hora = String(agora.getHours()).padStart(2, "0");
        const minuto = String(agora.getMinutes()).padStart(2, "0");

        const nomeArquivo = `BarberRD_Backup_${ano}-${mes}-${dia}_${hora}-${minuto}.json`;

        localStorage.setItem("barberpro_ultimo_backup", agora.toISOString());
        atualizarStatusBackup();

        if (navigator.share && navigator.canShare) {

            const arquivoBackup = new File([arquivo], nomeArquivo, {
                type: "application/json"
            });

            const dadosCompartilhamento = {
                title: "Backup do BARBER R.D",
                text: "Backup dos dados da minha barbearia.",
                files: [arquivoBackup]
            };

            if (navigator.canShare(dadosCompartilhamento)) {
                await navigator.share(dadosCompartilhamento);
                mostrarMensagem("Backup criado com sucesso.");
                return;
            }
        }

        const url = URL.createObjectURL(arquivo);
        const link = document.createElement("a");
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        mostrarMensagem("Backup salvo no dispositivo.");

    } catch (erro) {

        if (erro && erro.name === "AbortError") return;

        console.error("Erro ao fazer backup:", erro);
        mostrarMensagem("Não foi possível realizar o backup.");
    }

}


/* ==========================================================
   RESTAURAÇÃO SEGURA DO BACKUP
========================================================== */

function selecionarBackupBarberPro() {
    const input = document.getElementById("inputBackupBarberPro");
    if (input) {
        input.value = "";
        input.click();
    }
}


function validarEstruturaBackupBarberPro(backup) {

    if (!backup || typeof backup !== "object") {
        return { valido: false, motivo: "Arquivo vazio ou inválido." };
    }

    if (!backup.dados || typeof backup.dados !== "object") {
        return { valido: false, motivo: "O arquivo não contém os dados da barbearia." };
    }

    const chavesPermitidas = [
        "barberpro_agendamentos",
        "barberpro_clientes",
        "barberpro_servicos",
        "barberpro_configuracoes"
    ];

    const possuiDados = chavesPermitidas.some(chave =>
        Object.prototype.hasOwnProperty.call(backup.dados, chave)
    );

    if (!possuiDados) {
        return { valido: false, motivo: "Nenhum dado reconhecido do BARBER R.D foi encontrado." };
    }

    return { valido: true };
}


function formatarDataBackupBarberPro(valor) {

    if (!valor) return "Data não informada";

    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return "Data não informada";

    return data.toLocaleString("pt-BR");
}


async function restaurarBackupBarberPro(event) {

    const arquivo = event && event.target && event.target.files
        ? event.target.files[0]
        : null;

    if (!arquivo) return;

    try {

        if (!arquivo.name.toLowerCase().endsWith(".json")) {
            mostrarMensagem("Selecione um arquivo de backup .json.");
            return;
        }

        if (arquivo.size > 10 * 1024 * 1024) {
            mostrarMensagem("O arquivo de backup é muito grande.");
            return;
        }

        const texto = await arquivo.text();
        let backup;

        try {
            backup = JSON.parse(texto);
        } catch (erro) {
            mostrarMensagem("O arquivo selecionado não é um JSON válido.");
            return;
        }

        const validacao = validarEstruturaBackupBarberPro(backup);

        if (!validacao.valido) {
            mostrarMensagem(validacao.motivo);
            return;
        }

        const dados = backup.dados;
        const resumo = backup.resumo || {};

        const quantidadeAgendamentos = Array.isArray(dados.barberpro_agendamentos)
            ? dados.barberpro_agendamentos.length
            : Number(resumo.agendamentos || 0);

        const quantidadeClientes = Array.isArray(dados.barberpro_clientes)
            ? dados.barberpro_clientes.length
            : Number(resumo.clientes || 0);

        const quantidadeServicos = Array.isArray(dados.barberpro_servicos)
            ? dados.barberpro_servicos.length
            : Number(resumo.servicos || 0);

        const dataBackup = formatarDataBackupBarberPro(
            backup.dataBackup || backup.dataBackupLocal
        );

        const confirmacao = confirm(
            "RESTAURAR BACKUP\n\n" +
            "Data do backup: " + dataBackup + "\n" +
            "Agendamentos: " + quantidadeAgendamentos + "\n" +
            "Clientes: " + quantidadeClientes + "\n" +
            "Serviços: " + quantidadeServicos + "\n\n" +
            "ATENÇÃO: os dados atuais serão substituídos pelos dados deste backup.\n\n" +
            "Deseja continuar?"
        );

        if (!confirmacao) {
            mostrarMensagem("Restauração cancelada.");
            return;
        }

        const backupAtual = obterDadosBackupBarberPro();

        try {

            const chavesAtuais = Object.keys(backupAtual).filter(chave =>
                chave.startsWith("barberpro_") && chave !== "barberpro_ultimo_backup"
            );

            chavesAtuais.forEach(chave => localStorage.removeItem(chave));

            Object.keys(dados).forEach(chave => {

                if (!chave.startsWith("barberpro_")) return;

                const valor = dados[chave];

                if (typeof valor === "string") {
                    localStorage.setItem(chave, valor);
                } else {
                    localStorage.setItem(chave, JSON.stringify(valor));
                }
            });

            localStorage.setItem("barberpro_ultimo_backup", new Date().toISOString());

            mostrarMensagem("Backup restaurado com sucesso. O sistema será atualizado.");

            setTimeout(() => {
                window.location.reload();
            }, 900);

        } catch (erroRestauracao) {

            console.error("Erro ao restaurar backup:", erroRestauracao);

            /* Tenta devolver os dados que estavam presentes antes da restauração. */
            Object.keys(backupAtual).forEach(chave => {
                try {
                    const valor = backupAtual[chave];
                    localStorage.setItem(
                        chave,
                        typeof valor === "string" ? valor : JSON.stringify(valor)
                    );
                } catch (erroRollback) {
                    console.error("Erro no rollback:", erroRollback);
                }
            });

            mostrarMensagem("Não foi possível restaurar o backup. Os dados anteriores foram preservados.");
        }

    } catch (erro) {
        console.error("Erro ao restaurar backup:", erro);
        mostrarMensagem("Não foi possível ler o arquivo de backup.");
    }
}


function atualizarStatusBackup() {

    const elemento = document.getElementById("ultimoBackupStatus");
    if (!elemento) return;

    const ultimoBackup = localStorage.getItem("barberpro_ultimo_backup");

    if (!ultimoBackup) {
        elemento.textContent = "Nenhum backup realizado ainda.";
        return;
    }

    elemento.textContent =
        "Último backup: " + formatarDataBackupBarberPro(ultimoBackup);
}


window.addEventListener("load", atualizarStatusBackup);


/* ==========================================================
   ENTRADA ROCHA DIGITAL — ETAPA 1
========================================================== */

(function iniciarEntradaRochaDigital() {

    function prepararEntrada() {

        const tela = document.getElementById("telaEntradaRD");
        const botao = document.getElementById("btnEntrarRD");
        const barra = document.getElementById("barraEntradaRD");

        if (!tela || !botao || !barra) {
            return;
        }

        let progresso = 8;

        const intervalo = setInterval(() => {

            progresso += progresso < 72 ? 2.4 : 0.7;

            if (progresso >= 100) {
                progresso = 100;
                clearInterval(intervalo);
            }

            barra.style.width = `${progresso}%`;

        }, 45);

        setTimeout(() => {
            barra.style.width = "100%";
            botao.disabled = false;
        }, 1800);

        botao.addEventListener("click", () => {

            if (botao.disabled) {
                return;
            }

            tela.classList.add("saindo");

            setTimeout(() => {
                tela.remove();
            }, 700);

        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", prepararEntrada, { once: true });
    } else {
        prepararEntrada();
    }

})();


/* ==========================================================
   ETAPA 10 — PAINEL INTELIGENTE
   Usa somente dados reais já gravados no BARBER R.D.
========================================================== */

function rdDataLocalISO(dataObj) {
    const d = dataObj || new Date();
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

function rdInicioSemanaISO() {
    const hoje = new Date();
    const dia = hoje.getDay();
    const deslocamento = dia === 0 ? 6 : dia - 1;
    hoje.setHours(0, 0, 0, 0);
    hoje.setDate(hoje.getDate() - deslocamento);
    return rdDataLocalISO(hoje);
}

function rdInicioMesISO() {
    const hoje = new Date();
    return rdDataLocalISO(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
}

function rdAgendamentosConcluidosEntre(agendamentos, inicio, fim) {
    return agendamentos.filter(item =>
        item &&
        item.status === "concluido" &&
        String(item.data) >= inicio &&
        String(item.data) <= fim
    );
}

function rdSomaValores(lista) {
    return lista.reduce((total, item) => total + Number(item.valor || 0), 0);
}

function rdAtualizarPainelInteligente() {

    const painel = document.getElementById("rdPainelInteligente");
    if (!painel) return;

    const agendamentos = obterDados(CHAVES.agendamentos);
    const clientes = obterDados(CHAVES.clientes);
    const hoje = dataHojeISO();

    const inicioSemana = rdInicioSemanaISO();
    const inicioMes = rdInicioMesISO();

    const concluidosHoje = rdAgendamentosConcluidosEntre(
        agendamentos, hoje, hoje
    );

    const concluidosSemana = rdAgendamentosConcluidosEntre(
        agendamentos, inicioSemana, hoje
    );

    const concluidosMes = rdAgendamentosConcluidosEntre(
        agendamentos, inicioMes, hoje
    );

    const agendaHoje = agendamentos.filter(item =>
        item && String(item.data) === hoje
    );

    const concluidosHojeQtd = concluidosHoje.length;
    const totalHoje = agendaHoje.filter(item =>
        item.status !== "cancelado"
    ).length;

    const percentualConclusao = totalHoje > 0
        ? Math.round((concluidosHojeQtd / totalHoje) * 100)
        : 0;

    const elementos = {
        hoje: document.getElementById("rdIndicadorHoje"),
        hojeDetalhe: document.getElementById("rdIndicadorHojeDetalhe"),
        semana: document.getElementById("rdIndicadorSemana"),
        semanaDetalhe: document.getElementById("rdIndicadorSemanaDetalhe"),
        mes: document.getElementById("rdIndicadorMes"),
        mesDetalhe: document.getElementById("rdIndicadorMesDetalhe"),
        conclusao: document.getElementById("rdIndicadorConclusao"),
        conclusaoDetalhe: document.getElementById("rdIndicadorConclusaoDetalhe")
    };

    if (elementos.hoje) elementos.hoje.textContent = formatarMoeda(rdSomaValores(concluidosHoje));
    if (elementos.hojeDetalhe) elementos.hojeDetalhe.textContent = `${concluidosHojeQtd} atendimento${concluidosHojeQtd === 1 ? "" : "s"}`;
    if (elementos.semana) elementos.semana.textContent = formatarMoeda(rdSomaValores(concluidosSemana));
    if (elementos.semanaDetalhe) elementos.semanaDetalhe.textContent = `${concluidosSemana.length} atendimento${concluidosSemana.length === 1 ? "" : "s"}`;
    if (elementos.mes) elementos.mes.textContent = formatarMoeda(rdSomaValores(concluidosMes));
    if (elementos.mesDetalhe) elementos.mesDetalhe.textContent = `${concluidosMes.length} atendimento${concluidosMes.length === 1 ? "" : "s"}`;
    if (elementos.conclusao) elementos.conclusao.textContent = `${percentualConclusao}%`;
    if (elementos.conclusaoDetalhe) elementos.conclusaoDetalhe.textContent = `${concluidosHojeQtd} de ${totalHoje} concluídos`;

    rdRenderizarAlertas(agendamentos, clientes, hoje);
    rdRenderizarRankingServicos(concluidosMes);
    rdRenderizarReativacao(agendamentos, clientes, hoje);

    painel.classList.remove("rd-pulse-atualizacao");
    void painel.offsetWidth;
    painel.classList.add("rd-pulse-atualizacao");
}

function rdRenderizarAlertas(agendamentos, clientes, hoje) {

    const lista = document.getElementById("rdListaAlertas");
    const badge = document.getElementById("rdAlertaQuantidade");
    if (!lista) return;

    const alertas = [];

    const futurosHoje = agendamentos
        .filter(item =>
            item &&
            String(item.data) === hoje &&
            item.status === "agendado"
        )
        .sort((a, b) => String(a.hora || "").localeCompare(String(b.hora || "")));

    if (futurosHoje.length) {
        const proximo = futurosHoje[0];
        alertas.push({
            icone: "⏰",
            titulo: "Próximo atendimento",
            detalhe: `${proximo.hora || "--:--"} · ${proximo.cliente || "Cliente"}`,
            valor: proximo.servico || "Serviço"
        });
    }

    const canceladosHoje = agendamentos.filter(item =>
        item && String(item.data) === hoje && item.status === "cancelado"
    ).length;

    if (canceladosHoje) {
        alertas.push({
            icone: "↩",
            titulo: "Cancelamentos hoje",
            detalhe: `${canceladosHoje} atendimento${canceladosHoje === 1 ? "" : "s"} cancelado${canceladosHoje === 1 ? "" : "s"}`,
            valor: "Ver agenda"
        });
    }

    if (!futurosHoje.length && !agendamentos.some(item =>
        item && String(item.data) === hoje && item.status !== "cancelado"
    )) {
        alertas.push({
            icone: "📅",
            titulo: "Agenda de hoje está vazia",
            detalhe: "Nenhum atendimento registrado para hoje.",
            valor: "Cadastre um horário"
        });
    }

    if (badge) badge.textContent = String(alertas.length);

    if (!alertas.length) {
        lista.innerHTML = `
            <div class="rd-vazio-inteligente">
                <span>✓</span>
                <p>Tudo em ordem por enquanto.</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = alertas.map(alerta => `
        <div class="rd-item-inteligente">
            <span class="rd-item-icone">${alerta.icone}</span>
            <div class="rd-item-conteudo">
                <strong>${escaparHTML(alerta.titulo)}</strong>
                <small>${escaparHTML(alerta.detalhe)}</small>
            </div>
            <span class="rd-item-valor">${escaparHTML(alerta.valor)}</span>
        </div>
    `).join("");
}

function rdRenderizarRankingServicos(concluidosMes) {

    const lista = document.getElementById("rdRankingServicos");
    if (!lista) return;

    const ranking = {};

    concluidosMes.forEach(item => {
        const nome = String(item.servico || "Serviço").trim() || "Serviço";
        if (!ranking[nome]) ranking[nome] = { quantidade: 0, valor: 0 };
        ranking[nome].quantidade += 1;
        ranking[nome].valor += Number(item.valor || 0);
    });

    const ordenado = Object.entries(ranking)
        .sort((a, b) => b[1].quantidade - a[1].quantidade)
        .slice(0, 3);

    if (!ordenado.length) {
        lista.innerHTML = `
            <div class="rd-vazio-inteligente">
                <span>✂</span>
                <p>Os atendimentos concluídos aparecerão aqui.</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = ordenado.map(([nome, dados], indice) => `
        <div class="rd-item-inteligente">
            <span class="rd-item-icone">${indice + 1}</span>
            <div class="rd-item-conteudo">
                <strong>${escaparHTML(nome)}</strong>
                <small>${dados.quantidade} atendimento${dados.quantidade === 1 ? "" : "s"}</small>
            </div>
            <span class="rd-item-valor">${formatarMoeda(dados.valor)}</span>
        </div>
    `).join("");
}

function rdRenderizarReativacao(agendamentos, clientes, hoje) {

    const lista = document.getElementById("rdListaReativacao");
    const badge = document.getElementById("rdClientesInativos");
    if (!lista) return;

    const limite = new Date();
    limite.setHours(0, 0, 0, 0);
    limite.setDate(limite.getDate() - 30);
    const limiteISO = rdDataLocalISO(limite);

    const ultimaVisita = {};

    agendamentos
        .filter(item =>
            item &&
            item.status === "concluido" &&
            item.data
        )
        .forEach(item => {
            const chave = item.clienteId || String(item.cliente || "").trim().toLowerCase();
            if (!chave) return;
            if (!ultimaVisita[chave] || String(item.data) > ultimaVisita[chave].data) {
                ultimaVisita[chave] = {
                    data: String(item.data),
                    cliente: item.cliente || "Cliente",
                    telefone: item.telefone || ""
                };
            }
        });

    const candidatos = clientes
        .map(cliente => {
            const chave = cliente.id || String(cliente.nome || "").trim().toLowerCase();
            const visita = ultimaVisita[chave];
            return { cliente, visita };
        })
        .filter(item =>
            item.visita &&
            item.visita.data < limiteISO &&
            item.visita.data <= hoje
        )
        .sort((a, b) => String(a.visita.data).localeCompare(String(b.visita.data)));

    if (badge) badge.textContent = String(candidatos.length);

    if (!candidatos.length) {
        lista.innerHTML = `
            <div class="rd-vazio-inteligente">
                <span>👥</span>
                <p>Nenhum cliente precisa de atenção no momento.</p>
            </div>
        `;
        return;
    }

    const exibidos = candidatos.slice(0, 6);

    lista.innerHTML = exibidos.map(item => {
        const cliente = item.cliente;
        const telefone = cliente.telefone || item.visita.telefone || "";
        const iniciais = gerarIniciais(cliente.nome || item.visita.cliente);
        const urlWhats = telefone
            ? `https://wa.me/${String(telefone).replace(/\D/g, "")}`
            : "";

        return `
            <div class="rd-reativacao-item">
                <span class="rd-avatar-mini">${escaparHTML(iniciais)}</span>
                <div class="rd-reativacao-info">
                    <strong>${escaparHTML(cliente.nome || item.visita.cliente)}</strong>
                    <small>Último atendimento: ${formatarData(item.visita.data)}</small>
                </div>
                ${urlWhats ? `<button type="button" class="rd-reativacao-link" data-rd-whatsapp="${escaparHTML(urlWhats)}">WhatsApp</button>` : ""}
            </div>
        `;
    }).join("");

    lista.querySelectorAll("[data-rd-whatsapp]").forEach(botao => {
        botao.addEventListener("click", () => {
            window.open(botao.getAttribute("data-rd-whatsapp"), "_blank", "noopener");
        });
    });
}

(function iniciarPainelInteligenteRD() {

    function iniciar() {

        rdAtualizarPainelInteligente();

        const botao = document.getElementById("btnAtualizarPainelRD");
        if (botao) {
            botao.addEventListener("click", rdAtualizarPainelInteligente);
        }

        const notificacao = document.getElementById("btnNotificacao");
        if (notificacao) {
            notificacao.addEventListener("click", () => {
                rdAtualizarPainelInteligente();
                const painel = document.getElementById("rdPainelInteligente");
                if (painel) painel.scrollIntoView({ behavior: "smooth", block: "start" });
                mostrarMensagem("Painel inteligente atualizado.");
            });
        }

        setInterval(rdAtualizarPainelInteligente, 60000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }

})();

/* =====================================================
   ETAPA 11 — PWA / INSTALAÇÃO
===================================================== */
(function iniciarPwaBarberRD() {
    let eventoInstalacao = null;

    function estaInstalado() {
        return window.matchMedia("(display-mode: standalone)").matches ||
               window.navigator.standalone === true;
    }

    function atualizarBotao() {
        const botao = document.getElementById("btnInstalarPWA");
        if (!botao) return;
        botao.hidden = estaInstalado() || !eventoInstalacao;
    }

    window.addEventListener("beforeinstallprompt", event => {
        event.preventDefault();
        eventoInstalacao = event;
        atualizarBotao();
    });

    window.addEventListener("appinstalled", () => {
        eventoInstalacao = null;
        atualizarBotao();
        if (typeof mostrarMensagem === "function") {
            mostrarMensagem("BARBER R.D instalado com sucesso.");
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        const botao = document.getElementById("btnInstalarPWA");
        if (!botao) return;

        botao.addEventListener("click", async () => {
            if (!eventoInstalacao) return;

            eventoInstalacao.prompt();
            const resultado = await eventoInstalacao.userChoice;
            if (resultado && resultado.outcome === "accepted" &&
                typeof mostrarMensagem === "function") {
                mostrarMensagem("Instalação do BARBER R.D iniciada.");
            }

            eventoInstalacao = null;
            atualizarBotao();
        });

        atualizarBotao();
    });
})();
