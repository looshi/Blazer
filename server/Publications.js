

/* 
singleTemplateData
Publishes the current template used in the Editor, including all editable fields.
*/ 

Meteor.publish("singleTemplateData", function (_id,_userId) {

  var self = this;
  var initializing = true;

  var handle = TemplateCollection.find(_id).observeChanges({
    added: function (id, fields) {

      if(!initializing){
        self.added("CurrentTemplate",_id , fields  );
      }

    }, 
    changed: function (id, fields) {

      var userMadeChange = (_userId===TemplateCollection.findOne(_id).lastModifiedBy);

      // send changes to code if another user made the change
      // send changes to likes
      // send changes to template name
      if( !userMadeChange || fields.name || fields.likes ){
        self.changed("CurrentTemplate",id,fields);  // Only publish changes if a different user made the edit, or user renamed template
      }      
    },
    removed: function (id) {
      self.removed("CurrentTemplate",id);
    }
  });

  initializing = false;
  self.added("CurrentTemplate", _id, TemplateCollection.findOne(_id) );
  self.ready();
  self.onStop( function(){handle.stop();});

});

Meteor.publish("userData",function(){
  return Meteor.users.find({} , {fields : {'services.github.id':1,'services.github.username':1}} );
})

/* 
summaryTemplateData
Publishes the entire list of all Templates, limited to a few fields.
*/ 
Meteor.publish("summaryTemplateData", function () {
  return TemplateCollection.find({}, {fields: {'name': 1,'likes':1,'owner':1,'created':1 }} );
});


