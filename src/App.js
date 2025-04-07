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

  const [culturaSelecionado, setCulturaSelecionado] = useState({
    id: '',
    nome: '',
    tipo: '',
    area: '',
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

  //-----modal controle do estado 
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

  const pedidoPost=async()=>{
    delete culturaSelecionado.id;
    culturaSelecionado.area=parseFloat(culturaSelecionado.area);
      await axios.post(baseUrl, culturaSelecionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirFecharModalIncluir();
    }).catch(error=>{
      console.log(error);
    })
  }
  
  const culturaPut = async () => {
    await axios.put(baseUrl + "/" + culturaSelecionado.id, culturaSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        //eslint-disable-next-line
        dadosAuxiliar.map(cultura => {
          if (cultura.id === culturaSelecionado.id) {
            cultura.nome = resposta.nome;
            cultura.tipo = resposta.tipo;
            cultura.area = resposta.area;
            cultura.descricao = resposta.descricao;
          }
        });
        abrirFecharModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const culturaDelete = async () => {
    await axios.delete(baseUrl + "/" + culturaSelecionado.id)
      .then(response => {
        setData(data.filter(cultura => cultura.id !== response.data));
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
    <div className="cultura-container">
      <br />
      <h3>Lista de Culturas</h3>
      <header>
        <button onClick={() => abrirFecharModalIncluir()} className="btn btn-success">Incluir Nova Cultura</button>
      </header>
      <table className="table table-bordered" >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Área</th>
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
                <button className="btn btn-primary" onClick={() => selecionarCultura(cultura, "Editar")}>Editar</button> {"  "}
                <button className="btn btn-danger" onClick={() => selecionarCultura(cultura, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Culturas</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome:</label>
            <input type="text" className="form-control" name="nome" onChange={handleChange} />
            <label>Tipo:</label>
            <input type="text" className="form-control" name="tipo" onChange={handleChange} />
            <label>Área (ha):</label>
            <input type="number" className="form-control" name="area" onChange={handleChange} />
            <label>Descrição:</label>
            <textarea className="form-control" name="descricao" onChange={handleChange}></textarea>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>Incluir</button>{"   "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Cultura</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome:</label>
            <input type="text" className="form-control" name="nome" onChange={handleChange} value={culturaSelecionado && culturaSelecionado.nome} />
            <label>Tipo:</label>
            <input type="text" className="form-control" name="tipo" onChange={handleChange} value={culturaSelecionado && culturaSelecionado.tipo} />
            <label>Área (ha):</label>
            <input type="number" className="form-control" name="area" onChange={handleChange} value={culturaSelecionado && culturaSelecionado.area} />
            <label>Descrição:</label>
            <textarea className="form-control" name="descricao" onChange={handleChange} value={culturaSelecionado && culturaSelecionado.descricao}></textarea>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => culturaPut()}>Editar</button>{"   "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão desta cultura : {culturaSelecionado && culturaSelecionado.nome} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => culturaDelete()}>
            Sim
          </button>
          <button
            className="btn btn-secondary" onClick={() => abrirFecharModalExcluir()}
          >
            Não
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;