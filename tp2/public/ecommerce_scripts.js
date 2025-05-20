function new_form(categ) {

    const container = document.getElementById('new_f');
    container.innerHTML = '';

    // Crear form
    const form = document.createElement('form');
    form.setAttribute('method', 'get');
    form.setAttribute('action', '/productos')

    // Crear inputs
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'marca');
    input.setAttribute('placeholder', 'Marca del producto');
    input.className = 'input_l';
    form.appendChild(input);

    input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'modelo');
    input.setAttribute('placeholder', 'Modelo del producto');
    input.className = 'input_l';
    form.appendChild(input);

    input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'precio');
    input.setAttribute('placeholder', 'Precio');
    input.className = 'input_small';
    form.appendChild(input);

    input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'stock');
    input.setAttribute('placeholder', 'Stock');
    input.className = 'input_small';
    form.appendChild(input);

    input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 'categ');
    input.setAttribute('value', categ);
    form.appendChild(input);

    input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 'op');
    input.setAttribute('value', 'submit');
    form.appendChild(input);

    if (categ==1) {
        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'material');
        input.setAttribute('placeholder', 'Material');
        input.className = 'input_l';
        form.appendChild(input);

        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'talles');
        input.setAttribute('placeholder', 'Talles');
        input.className = 'input_l';
        form.appendChild(input);    

        }
    else if (categ==2) {  //campera
        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'talles');
        input.setAttribute('placeholder', 'Talles');
        input.className = 'input_l';
        form.appendChild(input);

        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'temporada');
        input.setAttribute('placeholder', 'Temporada');
        input.className = 'input_l';
        form.appendChild(input);

        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'color');
        input.setAttribute('placeholder', 'Color');
        input.className = 'input_l';
        form.appendChild(input);

        }
    else if (categ==3) { //pantalon
        form.appendChild(document.createElement('br'));
        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'ancho');
        input.setAttribute('placeholder', 'Ancho');
        input.className = 'input_small';
        form.appendChild(input);

        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'largo');
        input.setAttribute('placeholder', 'largo');
        input.className = 'input_small';
        form.appendChild(input);        
        }
    else {
        container.innerHTML = '';
        return;
    }

    // submit 
    const submit = document.createElement('button');
    submit.setAttribute('type', 'submit');
    submit.textContent = 'Submit';
    submit.className = 'submit_btn';

    form.appendChild(submit);

    container.appendChild(form);
}