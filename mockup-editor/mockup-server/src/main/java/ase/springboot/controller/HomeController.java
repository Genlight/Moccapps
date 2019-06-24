package ase.springboot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author group2
 *
 */
@Controller
@RequestMapping("/home")
public class HomeController {

	/**
	 * Maps the standard redirect to index.html
	 */
	@GetMapping
	public String home() {
		return "forward:/index.html";
	}

}