function new_form(categ) {
    //alert (categ);
    const container = document.getElementById('new_f');

    // Clear any existing content (optional)
    container.innerHTML = '';

    // Create the form
    const form = document.createElement('form');
    form.setAttribute('method', 'get');
    form.setAttribute('action', '/productos')

    // Create input field
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'marca');
    input.setAttribute('placeholder', 'Marca del producto');
    form.appendChild(input);

    input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'modelo');
    input.setAttribute('placeholder', 'Modelo del producto');
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

    // Create submit button
    const submit = document.createElement('button');
    submit.setAttribute('type', 'submit');
    submit.textContent = 'Submit';
    submit.className = 'submit_btn';

    // Append button to form
    form.appendChild(submit);

    // Append form to the container
    container.appendChild(form);
}