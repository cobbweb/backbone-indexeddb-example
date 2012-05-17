var NotepadDatabase = {
  id: "notepad",
  description: "My Backbone-powered Notepad",
  migrations: [
    {
      version: 1,
      migrate: function(transaction, next) {
        transaction.db.createObjectStore("notepad")
        next()
      }
    },
    {
      version: 2,
      migrate: function(transaction, next) {
        var store

        if (!transaction.db.objectStoreNames.contains("notepad")) {
          store = transaction.db.createObjectStore("notepad")
        } else {
          store = transaction.objectStore("notepad")
        }

        store.createIndex("titleIndex", "title", { unique: false })
        next()
      }
    }
  ]
}

var Note = Backbone.Model.extend({
  database: NotepadDatabase,
  storeName: NotepadDatabase.id
})

var AppView = Backbone.View.extend({

  el: "#notepad",

  events: {
    "click #save": "save"
  },

  initialize: function() {
    _.bindAll(this)
    this.$title = $("#title")
    this.$content = $("#content")

    this.model.on("change", this.render)
    this.model.fetch()
  },

  render: function() {
    this.$title.html(this.model.get("title"))
    this.$content.val(this.model.get("content"))
  },

  save: function() {
    this.model.save({
      title: this.$title.html(),
      content: this.$content.val()
    })
  }

})

var myNote = new Note({
  title: "Yellow"
})

new AppView({ model: myNote })