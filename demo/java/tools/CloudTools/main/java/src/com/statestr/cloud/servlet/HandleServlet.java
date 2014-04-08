package com.statestr.cloud.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.statestr.cloud.constant.Constant;

@SuppressWarnings("serial")
public class HandleServlet extends HttpServlet
{

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
	String toolCode = request.getParameter(Constant.REQUESTTOOlCODE);
	if ("PFDT".equals(toolCode))
	{
	    System.out.println("Hello World !");

	}
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
	doPost(request, response);
    }

}
