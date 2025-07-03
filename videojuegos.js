  
    const videojuegos = [
      { id: 1, nombre: "FC 2026", precio: 10000, genero: "Deportes" },
      { id: 2, nombre: "GTA VI", precio: 15000, genero: "Acción / Mundo abierto" },
      { id: 3, nombre: "God of War", precio: 12000, genero: "Aventura / Mitología" },
      { id: 4, nombre: "Red Dead Redemption 2", precio: 14000, genero: "Acción / Western" }
    ];


    function mostrarCatalogo() {
      console.log("🎮 Catálogo de Videojuegos:");

      console.log("1 - FC 2026 - $10000 - Deportes");
      console.log("2 - GTA VI - $15000 - Acción / Mundo abierto");
      console.log("3 - God of War - $12000 - Aventura / Mitología");
      console.log("4 - Red Dead Redemption 2 - $14000 - Acción / Western");
    }

     function obtenerJuegoPorId(id) {
      return videojuegos.find(function(juego) {
        return juego.id === id;
      });
    }


    
    function simulador() {
      mostrarCatalogo();
      let opcion = parseInt(prompt(
        "Elegí un videojuego para ver detalles:\n" +
        "1 - FC 2026\n" +
        "2 - GTA VI\n" +
        "3 - God of War\n" +
        "4 - Red Dead Redemption 2\n" +
        "0 - Salir"
      ));


      switch (opcion) {
        case 1:
        case 2:
        case 3:
        case 4:
         
          const seleccionado = obtenerJuegoPorId(opcion);


         
          alert(
            "🎮 Elegiste: " + seleccionado.nombre + "\n" +
            "💵 Precio: $" + seleccionado.precio + "\n" +
            "📚 Género: " + seleccionado.genero
          );
          break;


        case 0:
          alert("Gracias por visitar nuestra tienda de videojuegos 🎮");
          break;


        default:
          alert("❌ Opción inválida. Por favor, elegí un número del 1 al 4, o 0 para salir.");
          break;
      }


     
      console.log("Fin del simulador");
    }


    simulador();
