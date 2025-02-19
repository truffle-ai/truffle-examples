import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const fieldTypes = [
  'string',
  'number',
  'integer',
  'boolean',
  'array',
  'object'
];

// Helper function to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random()}`;

const SchemaField = ({ field, updateField, removeField, addNestedField, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-2">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 rounded-lg blur-lg group-hover:blur-xl transition-all opacity-70 -z-10" />
        <div className="relative flex items-center space-x-2 bg-card/80 backdrop-blur-sm rounded-lg border border-purple-500/20 shadow-sm">
          <Input
            placeholder="Field name"
            value={field.name}
            onChange={(e) => updateField({ ...field, name: e.target.value })}
            className="flex-grow h-9 text-sm bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-purple-500"
          />
          <Select
            value={field.type}
            onValueChange={(value) => updateField({ ...field, type: value })}
          >
            <SelectTrigger className="w-[120px] h-9 border-0 focus:ring-1 focus:ring-purple-500">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {fieldTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(field.type === 'object' || field.type === 'array') && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-purple-500/10"
              onClick={handleToggle}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
            onClick={() => removeField(field.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (field.type === 'object' || field.type === 'array') && (
        <div className="ml-6 pl-6 border-l-2 border-purple-500/20">
          {field.children.map((childField) => (
            <SchemaField
              key={childField.id}
              field={childField}
              updateField={(updatedChild) => {
                const updatedChildren = field.children.map((child) =>
                  child.id === updatedChild.id ? updatedChild : child
                );
                updateField({ ...field, children: updatedChildren });
              }}
              removeField={(childId) => {
                const updatedChildren = field.children.filter((child) => child.id !== childId);
                updateField({ ...field, children: updatedChildren });
              }}
              addNestedField={() => addNestedField(field.id)}
              level={level + 1}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNestedField(field.id)}
            className="mt-2 text-purple-500 border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-600"
          >
            <PlusCircle className="mr-1 h-3 w-3" /> Add Nested Field
          </Button>
        </div>
      )}
    </div>
  );
};

const JsonSchemaBuilder = ({ onSchemaChange, jsonSchema }) => {
  const [fields, setFields] = useState([]);
  const [schema, setSchema] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [name, setName] = useState(''); // Default name

  // Function to parse jsonSchema prop into fields
  const parseJsonSchemaToFields = (schemaObj) => {
    if (!schemaObj || schemaObj.type !== 'object') {
      return [];
    }

    const parseProperties = (properties) => {
      return Object.entries(properties).map(([key, value]) => {
        const field = {
          id: generateId(),
          name: key,
          type: value.type || 'string',
          children: []
        };

        if (value.type === 'object' && value.properties) {
          field.children = parseProperties(value.properties);
        } else if (value.type === 'array' && value.items) {
          if (value.items.type === 'object' && value.items.properties) {
            field.children = parseProperties(value.items.properties);
          } else if (value.items.type === 'array') {
            // Handle nested arrays if necessary
            // For simplicity, assuming only one level of nesting
            field.children = [];
          }
        }

        return field;
      });
    };

    return parseProperties(schemaObj.properties || {});
  };

  // Initialize fields and name from jsonSchema prop
  useEffect(() => {
    if (jsonSchema && jsonSchema.schema) {
      setName(jsonSchema.name);
      const parsedFields = parseJsonSchemaToFields(jsonSchema.schema);
      setFields(parsedFields);
    }
  }, []);

  const addField = (parentId = null) => {
    const newField = {
      id: generateId(),
      name: '',
      type: 'string',
      children: [],
    };

    if (parentId === null) {
      setFields([...fields, newField]);
    } else {
      const updatedFields = fields.map((field) => {
        if (field.id === parentId) {
          return { ...field, children: [...field.children, newField] };
        } else if (field.children.length > 0) {
          return {
            ...field,
            children: updateChildrenRecursively(field.children, parentId, newField),
          };
        }
        return field;
      });
      setFields(updatedFields);
    }
  };

  const updateChildrenRecursively = (children, parentId, newField) => {
    return children.map((child) => {
      if (child.id === parentId) {
        return { ...child, children: [...child.children, newField] };
      } else if (child.children.length > 0) {
        return {
          ...child,
          children: updateChildrenRecursively(child.children, parentId, newField),
        };
      }
      return child;
    });
  };

  const updateField = (updatedField) => {
    const updateFieldRecursively = (fields) => {
      return fields.map((field) => {
        if (field.id === updatedField.id) {
          return updatedField;
        } else if (field.children.length > 0) {
          return {
            ...field,
            children: updateFieldRecursively(field.children),
          };
        }
        return field;
      });
    };

    setFields(updateFieldRecursively(fields));
  };

  const removeField = (fieldId) => {
    const removeFieldRecursively = (fields) => {
      return fields.filter((field) => {
        if (field.id === fieldId) {
          return false;
        }
        if (field.children.length > 0) {
          field.children = removeFieldRecursively(field.children);
        }
        return true;
      });
    };

    const updatedFields = removeFieldRecursively(fields);
    setFields(updatedFields);
  };

  const generateSchemaObject = (fields) => {
    const schemaObject = {
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false, // Set additionalProperties to false at the root
    };

    fields.forEach((field) => {
      if (field.name) {
        let fieldSchema = { type: field.type };

        if (field.type === 'object') {
          if (field.children.length > 0) {
            fieldSchema = generateSchemaObject(field.children);
          } else {
            fieldSchema = { type: 'object', properties: {}, required: [], additionalProperties: false };
          }
        } else if (field.type === 'array') {
          if (field.children.length > 0) {
            fieldSchema = {
              type: 'array',
              items: generateSchemaObject(field.children),
              additionalProperties: false,
            };
          } else {
            fieldSchema = {
              type: 'array',
              items: { type: 'string' }, // Default to string if no children
              additionalProperties: false,
            };
          }
        }

        schemaObject.properties[field.name] = fieldSchema;
        schemaObject.required.push(field.name);
      }
    });

    return schemaObject;
  };

  const generateSchema = () => {
    const generatedSchema = generateSchemaObject(fields);
    const newSchema = {
      name: name, // Include the name
      strict: true,
      schema: generatedSchema,
    };
    setSchema(newSchema);
    if (onSchemaChange) {
      onSchemaChange(newSchema);
    }
  };

  useEffect(() => {
    generateSchema();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, name]); // Also regenerate when name changes

  return (
    <div className="space-y-2 bg-background text-foreground p-4 rounded-md border border-border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">JSON Schema Builder</h3>
        <Button
          type="button" // Prevent form submission
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs flex items-center"
        >
          {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>
      </div>

      {/* Optional: Field to set the name */}
      <div className="flex items-center space-x-2">
        <label htmlFor="schema-name" className="text-sm font-medium">
          Schema Name:
        </label>
        <Input
          id="schema-name"
          placeholder="Enter schema name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-grow h-8 text-sm"
        />
      </div>

      <div className="space-y-2">
        {fields.map((field) => (
          <SchemaField
            key={field.id}
            field={field}
            updateField={updateField}
            removeField={removeField}
            addNestedField={addField}
          />
        ))}
        <Button
          type="button" // Prevent form submission
          variant="outline"
          size="sm"
          onClick={() => addField()}
          className="w-full"
        >
          <PlusCircle className="mr-1 h-3 w-3" /> Add Field
        </Button>
      </div>
      {showPreview && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-1">Generated Schema:</h4>
          <pre className="bg-muted text-muted-foreground p-2 rounded-md text-xs overflow-x-auto">
            {JSON.stringify(schema, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default JsonSchemaBuilder;
