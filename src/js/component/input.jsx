import React, { useState, useEffect } from 'react';

const makeRandomId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const Input = () => {
    const [listItem, setListItem] = useState([]);

    const enter = (e) => {
        if (e.key === 'Enter') {
            const value = e.target.value.trim();
            if (value === "") {
                alert("La tarea no puede estar vacía");
            } else {
                const newTask = { "id": makeRandomId(8), "label": value, "done": false };
                setListItem([...listItem, newTask]);
                e.target.value = "";
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://playground.4geeks.com/apis/fake/todos/user/AnaMCS26");
                if (!response.ok && response.status === 404) {
                    await crearUsuario();
                } else {
                    const data = await response.json();
                    setListItem(data);
                }
            } catch (error) {
                console.error("Error cargando tareas", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const updateTasks = async () => {
            if (listItem.length !== 0) {
                const requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(listItem)
                };
                try {
                    await fetch("https://playground.4geeks.com/apis/fake/todos/user/AnaMCS26", requestOptions);
                } catch (error) {
                    console.error("Error actualizando tareas: ", error);
                }
            }
        };
        updateTasks();
    }, [listItem]);

    const deleteItem = (deletedItem) => {
        const newList = listItem.filter((el) => el.id !== deletedItem.id);
        setListItem(newList);
    };

    
    const deleteAll = () => {
        setListItem([]);
    };

    const deleteAllItems = async () => {
        try {
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            };
            await fetch("https://playground.4geeks.com/apis/fake/todos/user/AnaMCS26", requestOptions);
            setListItem([]);
            alert('Di adiós a todo');
        } catch (error) {
            console.error("Error eliminando tareas: ", error);
        }
    };

    const deleteTasks = () => {
        setListItem([]);
    };

    const lista = listItem.map((el, index) => (
        <div id="item" key={index}>
            <li className='d-flex justify-content-between'>
                <p className='mt-4 ms-4'>{el.label}</p>
                <a className='mt-3 pt-2' href='#' role='button' onClick={() => deleteItem(el)}>
                    <i id='poke' className="fa-solid fa-delete-left"></i>
                </a>
            </li>
        </div>
    ));

    return (
        <div className='mt-5'>
            <div className='d-flex justify-content-end me-5'>
                <button type="button" onClick={deleteTasks} className="btn btn-outline-primary deleteall">Delete Tasks</button>
                <button type="button" onClick={deleteAllItems} className="btn btn btn-danger deleteall">Delete All</button>
            </div>
            <h1 className='pt-5'>My to do list</h1>
            <div className='container' id='container-lista'>
                <div className='' id='container-input'>
                    <input className="mt-4" type="text" onKeyDown={enter} placeholder='Algo para anotar?' />
                </div>
                <div className='' id='container-items'>
                    <ul>
                        {listItem.length === 0 ? "No hay tareas" : lista}
                        <hr />
                    </ul>
                </div>
                <div className='d-flex justify-content-start text-light ps-4 pt-2' id='poke-list-foot'>
                    <p>List Items</p>
                    <p id='numberlist'>{listItem.length}</p>
                </div>
            </div>
        </div>
    );
};

async function crearUsuario() {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([])
    };
    try {
        await fetch("https://playground.4geeks.com/apis/fake/todos/user/AnaMCS26", requestOptions);
    } catch (error) {
        console.error("Error creando usuario: ", error);
    }
}

export default Input;
