-- Create manufacturer_class table

CREATE DATABASE EtherWeave;

-- Connect to the EtherWeave database
\c etherweave


CREATE TABLE manufacturer_class(
    company_name varchar(255) NOT NULL,
    contact_number varchar(20) NOT NULL,
    email_address varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    country varchar(100) NOT NULL,
    PRIMARY KEY(company_name)
);
CREATE UNIQUE INDEX manufacturer_class_email_address_key ON manufacturer_class USING btree ("email_address");

-- Create supplier_class table
CREATE TABLE supplier_class(
    company_name varchar(255) NOT NULL,
    contact_number varchar(20) NOT NULL,
    email_address varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    country varchar(100) NOT NULL,
    PRIMARY KEY(company_name)
);
CREATE UNIQUE INDEX supplier_class_email_address_key ON supplier_class USING btree ("email_address");

-- Create user_class table
CREATE TABLE user_class(
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    phone_number varchar(20) NOT NULL,
    email_address varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    last_login timestamp with time zone,
    PRIMARY KEY(email_address)
);
CREATE UNIQUE INDEX user_class_email_address_key ON user_class USING btree ("email_address");

-- Create user_login table
CREATE TABLE user_login(
    email varchar(100) NOT NULL,
    password varchar(300) NOT NULL,
    user_type varchar(100),
    PRIMARY KEY(email)
);

INSERT INTO user_login (email, password, user_type)
VALUES ('admin@etherweave.com', 'admin', 'admin');


CREATE OR REPLACE FUNCTION manufacturer_class_insert_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_login(email, password, user_type)
  VALUES (NEW.email_address, NEW.password, 'manufacturer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manufacturer_class_insert
AFTER INSERT ON manufacturer_class
FOR EACH ROW
EXECUTE PROCEDURE manufacturer_class_insert_trigger();

CREATE OR REPLACE FUNCTION manufacturer_class_update_trigger()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_login
  SET email = NEW.email_address, password = NEW.password
  WHERE email = OLD.email_address;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manufacturer_class_update
AFTER UPDATE ON manufacturer_class
FOR EACH ROW
EXECUTE PROCEDURE manufacturer_class_update_trigger();

CREATE OR REPLACE FUNCTION manufacturer_class_delete_trigger()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM user_login WHERE email = OLD.email_address;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manufacturer_class_delete
AFTER DELETE ON manufacturer_class
FOR EACH ROW
EXECUTE PROCEDURE manufacturer_class_delete_trigger();

CREATE OR REPLACE FUNCTION user_class_insert_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_login(email, password, user_type)
  VALUES (NEW.email_address, NEW.password, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_class_insert
AFTER INSERT ON user_class
FOR EACH ROW
EXECUTE PROCEDURE user_class_insert_trigger();

CREATE OR REPLACE FUNCTION user_class_update_trigger()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_login
  SET email = NEW.email_address, password = NEW.password
  WHERE email = OLD.email_address;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_class_update
AFTER UPDATE ON user_class
FOR EACH ROW
EXECUTE PROCEDURE user_class_update_trigger();

CREATE OR REPLACE FUNCTION user_class_delete_trigger()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM user_login WHERE email = OLD.email_address;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_class_delete
AFTER DELETE ON user_class
FOR EACH ROW
EXECUTE PROCEDURE user_class_delete_trigger();

CREATE OR REPLACE FUNCTION supplier_class_insert_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_login(email, password, user_type)
  VALUES (NEW.email_address, NEW.password, 'supplier');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER supplier_class_insert
AFTER INSERT ON supplier_class
FOR EACH ROW
EXECUTE PROCEDURE supplier_class_insert_trigger();

CREATE OR REPLACE FUNCTION supplier_class_update_trigger()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_login
  SET email = NEW.email_address, password = NEW.password
  WHERE email = OLD.email_address;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER supplier_class_update
AFTER UPDATE ON supplier_class
FOR EACH ROW
EXECUTE PROCEDURE supplier_class_update_trigger();

CREATE OR REPLACE FUNCTION supplier_class_delete_trigger()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM user_login WHERE email = OLD.email_address;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER supplier_class_delete
AFTER DELETE ON supplier_class
FOR EACH ROW
EXECUTE PROCEDURE supplier_class_delete_trigger();



INSERT INTO manufacturer_class (company_name, contact_number, email_address, password, country)
VALUES 
('Tech Corp', '1234567890', 'contact@techcorp.com', 'password123', 'USA'),
('Global Industries', '0987654321', 'info@globalindustries.com', 'securepass456', 'Germany'),
('Bright Electronics', '1231231234', 'support@brightelectronics.com', 'bright789', 'Japan');


INSERT INTO supplier_class (company_name, contact_number, email_address, password, country)
VALUES 
('SupplyChain Ltd', '5554443322', 'contact@supplychain.com', 'chainpass123', 'UK'),
('Raw Materials Co', '6665554443', 'info@rawmaterials.com', 'rawpass456', 'India'),
('Logistics International', '7778889990', 'service@logisticsintl.com', 'logistics789', 'Australia');

INSERT INTO user_class (first_name, last_name, phone_number, email_address, password, last_login)
VALUES 
('John', 'Doe', '1112223333', 'john.doe@example.com', 'password123', CURRENT_TIMESTAMP),
('Jane', 'Smith', '4445556666', 'jane.smith@example.com', 'janepass456', CURRENT_TIMESTAMP),
('Alan', 'Walker', '7778889991', 'alan.walker@example.com', 'walkerpass789', CURRENT_TIMESTAMP);
