module.exports =
  schema :
    title : String
    price : Number
    clickUrl : String
    imgSrc : String
    type : String
    desc : String
    createdAt : String
    size : []
    likeTotal :
      type : Number
      default : 0
    online : 
      type : Boolean
      default : false
  indexes : [
    {
      createdAt : 1
    }
    {
      type : 1
    }
    {
      createdAt : 1
      type : 1
    }
  ]
