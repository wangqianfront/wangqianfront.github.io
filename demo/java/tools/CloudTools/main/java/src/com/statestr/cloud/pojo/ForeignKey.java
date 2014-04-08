package com.statestr.cloud.pojo;

public class ForeignKey
{
    private String childColumn;
    private String childTable;
    private String parentColumn;
    private String parentTable;

    public ForeignKey(String childColumn, String childTable, String parentColumn, String parentTable)
    {
	this.childColumn = childColumn;
	this.childTable = childTable;
	this.parentColumn = parentColumn;
	this.parentTable = parentTable;
    }

    public String getChildColumn()
    {
	return childColumn;
    }

    public String getChildTable()
    {
	return childTable;
    }

    public String getParentColumn()
    {
	return parentColumn;
    }

    public String getParentTable()
    {
	return parentTable;
    }

}
