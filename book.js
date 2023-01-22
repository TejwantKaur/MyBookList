//  Book Class: Represents a book
class Book{
    constructor (title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// UI Class:Handle
class UI{
    static displayBooks(){
        // const storedBooks = [
        //     {
        //         title: 'Book one', 
        //         author: 'John Doe',
        //         isbn: '3434434'
        //     },
        //     {
        //         title: 'Book two',
        //         author: 'Jane Doe',
        //         isbn: '45545'
        //     }
        // ];
        // const books = storedBooks;
        const books = Store.getBooks();

        books.forEach((book)=>UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
        <td class="item">${book.title}</td>
        <td class="item">${book.author}</td>
        <td class="item">${book.isbn}</td>
        <td class="last-td"><a href="#" class="btnr delt">x</a></td>
        `;
        list.appendChild(row);
    }
    static clearField(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
    }
    static deletebook(el){
        if(el.classList.contains('delt')){
            el.parentElement.parentElement.remove();
        }
    }
    static showAlert(message,className){
        const div = document.createElement('div');
        div.className=`alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // vanish in 3 sec
        setTimeout( ()=>document.querySelector('.alert').remove(),3000);
        // 3000ms means 3secs
    }
}

// Store Class: Handle Storage, Local Storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')=== null){
            books = [];
        } else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books; 
    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        
        const books = Store.getBooks();

        books.forEach((book,index)=>{
            if(book.isbn === isbn){
                books.splice(index,1);
                // start,count
            }
        });
        localStorage.setItem('books',JSON.stringify(books));
    }  
}

// Event: Display Books
document.addEventListener('DOMContentLoaded',UI.displayBooks);

   // Event: Add a Book
document.querySelector('#book-form').addEventListener('submit',(e)=>{

    // prevent actual submit
    e.preventDefault();

    // get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate 
    if(title === '' || author==='' || isbn === ''){
        UI.showAlert('Please fill all fields','danger');
    }else{
        // Instantiate book
        const book = new Book(title,author,isbn);

        // console.log(book);

        // Add Book to list
        UI.addBookToList(book);

        // Add book to Store
        Store.addBook(book);

        // book added message
        UI.showAlert('Book Added','success')

        // clearFields
       UI.clearField();
    } 
});

// Event: Remove a Book

document.querySelector('#book-list').addEventListener('click',(e)=>{
    // console.log(e.target)

    if(confirm('Are You Sure?')){
        // Remove form UI
        UI.deletebook(e.target);

        // Remove from Store
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent); 
        // will give isbn

        UI.showAlert('Book Removed Successfully','success');
    }
})

var filter = document.getElementById('filter');
filter.addEventListener('keyup',filterItems);
var itemList = document.getElementsById('book-list');

function filterItems(e){

    var text = e.target.value.toLowerCase();
    var items = itemList.getElementsByTagName('td');

    Array.from(items).forEach(function(item){
        var itemName = item.firstChild.textContent;
        if(itemName.toLowerCase().indexOf(text)!= -1){
            item.style.display = 'block';
        } 
        else{
            item.style.display = 'none';
        }
    })
}