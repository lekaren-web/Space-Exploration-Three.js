window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth - 170, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  });

  const animate = function () {
    requestAnimationFrame(animate);
    camera.rotation.z -= document.getElementById("speed").value / 450;
    earth2.rotation.y += 0.00000001;
    ven.rotation.x -= 0.000002;
    mars.rotation.y -= 0.000001;
    jup.rotation.y += 0.0000001;
    renderer.render(scene, camera);
  }; 


  this.tl1.to(ven.position, 4, { x: 1 });
  this.tl2.to(sun.position, 4, { x: 1 });
  this.tl3.to(merc.position, 4, { x: 1 });
  this.tl4.to(earth.position, 4, { x: 1 });
  this.tl5.to(earth2.position, 4, { x: 1 });
  this.tl6.to(mars.position, 4, { x: 1 });
  this.tl7.to(jup.position, 4, { x: 1 });
  this.tl8.to(sat.position, 4, { x: 1 });
  this.tl9.to(uran.position, 4, { x: 1 });
  this.tl10.to(nep.position, 4, { x: 1 });
  this.tl11.to(plu.position, 4, { x: 1 });

  //align
  this.tl3.to(merc.position, 9, { y: 60 });
  this.tl1.to(ven.position, 9, { y: 80 });
  this.tl4.to(earth.position, 9, { y: 100 });
  this.tl5.to(earth2.position, 9, { y: 120 });
  this.tl6.to(mars.position, 9, { y: 140 });
  this.tl7.to(jup.position, 9, { y: 160 });
  this.tl8.to(sat.position, 9, { y: 180 });
  this.tl9.to(uran.position, 9, { y: 200 });
  this.tl10.to(nep.position, 9, { y: 220 });
  this.tl11.to(plu.position, 9, { y: 240 });

  //undo
  this.tl3.to(merc.position, 6, { y: 50 }); //
  this.tl1.to(ven.position, 6, { y: 70 }); //
  this.tl4.to(earth.position, 6, { y: -80 }); //
  this.tl5.to(earth2.position, 6, { y: -80 }); //
  this.tl6.to(mars.position, 6, { y: -150 }); //
  this.tl7.to(jup.position, 6, { y: -190 }); //
  this.tl8.to(sat.position, 6, { y: -220 }); //
  this.tl9.to(uran.position, 6, { y: 270 }); //
  this.tl10.to(nep.position, 6, { y: 300 }); //
  this.tl11.to(plu.position, 6, { y: 340 });

  this.tl1.to(ven.position, 6, { x: 70 }); //
  this.tl3.to(merc.position, 6, { x: 50 }); //
  this.tl4.to(earth.position, 6, { x: 80 }); //
  this.tl5.to(earth2.position, 6, { x: 80 }); //
  this.tl6.to(mars.position, 6, { x: -50 }); //
  this.tl7.to(jup.position, 6, { x: 100 }); //
  this.tl8.to(sat.position, 6, { x: 190 }); //
  this.tl9.to(uran.position, 6, { x: 9 }); //
  this.tl10.to(nep.position, 6, { x: 90 });
  this.tl11.to(plu.position, 6, { x: 10 });

  document.querySelector("button").addEventListener("click", () => {
    tl.play().restart();
    tl1.play().restart();
    tl2.play().restart();
    tl3.play().restart();
    tl4.play().restart();
    tl5.play().restart();
    tl6.play().restart();
    tl7.play().restart();
    tl8.play().restart();
    tl9.play().restart();
    tl10.play().restart();
    tl11.play().restart();
  });

  document.addEventListener("mousewheel", (event) => {
    camera.position.z += event.deltaY / 6;

  });

  animate();
