import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

function App() {

  const baseUrl = "http://localhost:5215/api/Culturas";
  const [data, setData] = useState([]);

  const [modalEditar, setModalEditar] = useState(false);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [validarCampos, setValidarCampos] = useState(false);


  const [culturaSelecionado, setCulturaSelecionado] = useState({
    id: 0,
    nome: '',
    tipo: '',
    area: 0,
    descricao: ''
  })

  const handleChange = e => {
    const { name, value } = e.target;
    setCulturaSelecionado({
      ...culturaSelecionado,
      [name]: value
    });
    console.log(culturaSelecionado);
  }

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  }

  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPost = async () => {
    const { nome, tipo, area } = culturaSelecionado;

    setValidarCampos(true);

    if (!nome || !tipo || !area) return;


    delete culturaSelecionado.id;
    culturaSelecionado.area = parseFloat(culturaSelecionado.area);
    await axios.post(baseUrl, culturaSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
      }).catch(error => {
        console.log(error);
      })
  }

  const culturaPut = async () => {
    const { nome, tipo, area } = culturaSelecionado;

    setValidarCampos(true);

    if (!nome || !tipo || !area) return;

    await axios.put(baseUrl + "/" + culturaSelecionado.id, culturaSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(cultura => {
          if (cultura.id === culturaSelecionado.id) {
            cultura.nome = resposta.nome;
            cultura.tipo = resposta.tipo;
            cultura.area = resposta.area;
            cultura.descricao = resposta.descricao;
          }
        });
        pedidoGet();
        abrirFecharModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const culturaDelete = async () => {
    await axios.delete(baseUrl + "/" + culturaSelecionado.id)
      .then(response => {
        setData(data.filter(cultura => cultura.id !== culturaSelecionado.id));
        abrirFecharModalExcluir();
      }).catch(error => {
        console.log(error);
      })
  }

  const selecionarCultura = (cultura, caso) => {
    setCulturaSelecionado(cultura);
    (caso === "Editar") ?
      abrirFecharModalEditar() : abrirFecharModalExcluir();
  }

  useEffect(() => {
    pedidoGet();
  }, []);


  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🌾 Lista de Culturas</h2>
      <div className="d-flex justify-content-end mb-3">
        <button onClick={abrirFecharModalIncluir} className="btn btn-success">
          <i className="bi bi-plus-circle"></i> Nova Cultura
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Área (ha)</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map(cultura => (
              <tr key={cultura.id}>
                <td>{cultura.id}</td>
                <td>{cultura.nome}</td>
                <td>{cultura.tipo}</td>
                <td>{cultura.area}</td>
                <td>{cultura.descricao}</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => selecionarCultura(cultura, "Editar")}>
                    <i className="bi bi-pencil-square"></i> Editar
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => selecionarCultura(cultura, "Excluir")}>
                    <i className="bi bi-trash"></i> Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Culturas</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              className={`form-control ${validarCampos && !culturaSelecionado.nome ? 'is-invalid' : ''}`}
              name="nome"
              onChange={handleChange}
            />

            <label>Tipo:</label>
            <input
              type="text"
              className={`form-control ${validarCampos && !culturaSelecionado.tipo ? 'is-invalid' : ''}`}
              name="tipo"
              onChange={handleChange}
            />

            <label>Área (ha):</label>
            <input
              type="number"
              className={`form-control ${validarCampos && !culturaSelecionado.area ? 'is-invalid' : ''}`}
              name="area"
              onChange={handleChange}
            />

            <label>Descrição:</label>
            <textarea
              className="form-control"
              name="descricao"
              onChange={handleChange}
            ></textarea>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>Incluir</button>{" "}
          <button className="btn btn-danger" onClick={() => { abrirFecharModalIncluir(); setValidarCampos(false); }}>Cancelar</button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Cultura</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              className={`form-control ${validarCampos && !culturaSelecionado.nome ? 'is-invalid' : ''}`}
              name="nome"
              onChange={handleChange}
              value={culturaSelecionado.nome || ''}
            />
            {validarCampos && !culturaSelecionado.nome && (
              <div className="invalid-feedback">Campo obrigatório</div>
            )}

            <label>Tipo:</label>
            <input
              type="text"
              className={`form-control ${validarCampos && !culturaSelecionado.tipo ? 'is-invalid' : ''}`}
              name="tipo"
              onChange={handleChange}
              value={culturaSelecionado.tipo || ''}
            />
            {validarCampos && !culturaSelecionado.tipo && (
              <div className="invalid-feedback">Campo obrigatório</div>
            )}

            <label>Área (ha):</label>
            <input
              type="number"
              className={`form-control ${validarCampos && !culturaSelecionado.area ? 'is-invalid' : ''}`}
              name="area"
              onChange={handleChange}
              value={culturaSelecionado.area || ''}
            />
            {validarCampos && !culturaSelecionado.area && (
              <div className="invalid-feedback">Campo obrigatório</div>
            )}

            <label>Descrição:</label>
            <textarea
              className="form-control"
              name="descricao"
              onChange={handleChange}
              value={culturaSelecionado.descricao || ''}
            ></textarea>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => culturaPut()}>Editar</button>{" "}
          <button className="btn btn-danger" onClick={() => { abrirFecharModalEditar(); setValidarCampos(false); }}>Cancelar</button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={modalExcluir}>
        <ModalHeader className="bg-danger text-white">Confirmação</ModalHeader>
        <ModalBody>
          Tem certeza que deseja excluir a cultura <strong>{culturaSelecionado && culturaSelecionado.nome}</strong>?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={culturaDelete}>
            <i className="bi bi-trash-fill"></i> Sim, excluir
          </button>
          <button className="btn btn-secondary" onClick={abrirFecharModalExcluir}>
            <i className="bi bi-x-circle"></i> Cancelar
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;