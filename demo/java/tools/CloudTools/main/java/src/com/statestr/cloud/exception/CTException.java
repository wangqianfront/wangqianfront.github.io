package com.statestr.cloud.exception;

public class CTException extends RuntimeException
{
    private static final long serialVersionUID = 1L;

    public CTException(String message)
    {
	super(message);
    }

    public CTException(String message, Throwable throwable)
    {
	super(message, throwable);
    }

    public CTException(Throwable throwable)
    {
	super(throwable);
    }

    public CTException(Exception e)
    {
	super(e);
    }
}
