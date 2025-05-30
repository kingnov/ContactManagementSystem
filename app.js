var Contact = /** @class */ (function () {
    function Contact(id, name, email, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
    return Contact;
}());
var ContactManager = /** @class */ (function () {
    function ContactManager() {
        this.contacts = [];
        this.currentEditId = null;
        this.loadContacts();
        this.setupEventListeners();
        this.renderContacts();
    }
    ContactManager.prototype.saveContacts = function () {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    };
    ContactManager.prototype.loadContacts = function () {
        var stored = localStorage.getItem('contacts');
        this.contacts = stored ? JSON.parse(stored) : [];
    };
    ContactManager.prototype.generateId = function () {
        return Date.now().toString();
    };
    ContactManager.prototype.setupEventListeners = function () {
        var _this = this;
        var form = document.getElementById('contactForm');
        var cancelBtn = document.getElementById('cancelBtn');
        form.onsubmit = function (e) {
            e.preventDefault();
            var name = document.getElementById('name').value;
            var email = document.getElementById('email').value;
            var phone = document.getElementById('phone').value;
            if (_this.currentEditId) {
                _this.updateContact(_this.currentEditId, name, email, phone);
            }
            else {
                _this.addContact(name, email, phone);
            }
            form.reset();
        };
        cancelBtn.onclick = function () {
            _this.currentEditId = null;
            document.getElementById('submitBtn').textContent = 'Add Contact';
            cancelBtn.style.display = 'none';
            form.reset();
        };
    };
    ContactManager.prototype.addContact = function (name, email, phone) {
        var newContact = new Contact(this.generateId(), name, email, phone);
        this.contacts.push(newContact);
        this.saveContacts();
        this.renderContacts();
    };
    ContactManager.prototype.updateContact = function (id, name, email, phone) {
        var contact = this.contacts.find(function (c) { return c.id === id; });
        if (contact) {
            contact.name = name;
            contact.email = email;
            contact.phone = phone;
        }
        this.currentEditId = null;
        document.getElementById('submitBtn').textContent = 'Add Contact';
        document.getElementById('cancelBtn').style.display = 'none';
        this.saveContacts();
        this.renderContacts();
    };
    ContactManager.prototype.deleteContact = function (id) {
        this.contacts = this.contacts.filter(function (c) { return c.id !== id; });
        this.saveContacts();
        this.renderContacts();
    };
    ContactManager.prototype.editContact = function (id) {
        var contact = this.contacts.find(function (c) { return c.id === id; });
        if (contact) {
            document.getElementById('name').value = contact.name;
            document.getElementById('email').value = contact.email;
            document.getElementById('phone').value = contact.phone;
            this.currentEditId = contact.id;
            document.getElementById('submitBtn').textContent = 'Update Contact';
            document.getElementById('cancelBtn').style.display = 'inline-block';
        }
    };
    ContactManager.prototype.renderContacts = function () {
        var _this = this;
        var container = document.getElementById('contactsContainer');
        container.innerHTML = '';
        if (this.contacts.length === 0) {
            container.innerHTML = '<p class="noContacts">No contacts found.</p>';
            return;
        }
        this.contacts.forEach(function (contact) {
            var item = document.createElement('div');
            item.className = 'contactItem';
            item.innerHTML = "\n          <div class=\"contactInfo\">\n            <p><strong>Name:</strong> ".concat(contact.name, "</p>\n            <p><strong>Email:</strong> ").concat(contact.email, "</p>\n            <p><strong>Phone:</strong> ").concat(contact.phone, "</p>\n          </div>\n          <div class=\"contactActions\">\n            <button class=\"btn btnEdit\">Edit</button>\n            <button class=\"btn btn-danger\">Delete</button>\n          </div>\n        ");
            var _a = item.querySelectorAll('button'), editBtn = _a[0], deleteBtn = _a[1];
            editBtn.addEventListener('click', function () { return _this.editContact(contact.id); });
            deleteBtn.addEventListener('click', function () { return _this.deleteContact(contact.id); });
            container.appendChild(item);
        });
    };
    return ContactManager;
}());
new ContactManager();
