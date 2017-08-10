const identityMap = {
  type : {
    "2" : "corporation",
    "3" : "agent"
  },
  passType : {
    "-2" : false,
    "-1" : false,
    "1" : true,
    "0" : false
  }
}

const accountMap = {
	type : {
		"OffLinePayAuth" : "bond",
		"OffLineSubmitInfo" : "information"
	},
	passType : {
		"1" : false,
		"2" : false,
		"3" : true
	}
}

const supplementMap = {
	passType : {
		"0" : false,
		"1" : true
	},
}


export default {
	identityMap : identityMap,
	accountMap : accountMap,
	supplementMap : supplementMap
}