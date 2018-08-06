// $(function(){
// 	$('form').on('submit', function(event){
// 		console.log('post called')
// 		event.preventDefault();
// 		let form = $(this);
// 		console.log(form);
// 		let userData = form.serialize();
// 		$.ajax({
// 			type: 'POST',
// 			url: '/newUser',
// 			data: userData,
// 		}).done(function(userData){
// 			console.log('done function called');
// 		});
// 	});
// });
var CurrentPlayer; 
var ThisPlayer;
if(!ThisPlayer){
    window.onload = httpRequest('http://localhost:8080/getUser',function(user){
        ThisPlayer = CurrentPlayer = JSON.parse(user);
    }
)
}
