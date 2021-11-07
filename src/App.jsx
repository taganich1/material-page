import React, { useEffect, useState } from 'react';
import './App.scss';

/*
function App() {

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ emailDirty, setEmailDirty ] = useState(false);
  const [ passwordDirty, setPasswordDirty ] = useState(false);
  const [ emailError, setEmailError ] = useState('Email cannot be empty');
  const [ passwordError, setPasswordError ] = useState('Password cannot be empty');
  const [ formIsValid, setFormIsValid ] = useState(false);



  useEffect(() => {
    if ( emailError || passwordError ) {
      setFormIsValid(false);
    } else {
      setFormIsValid(true);

    }
  }, [ emailError, passwordError ]);

  const emailHandler = (e) => {
    setEmail(e.target.value);
    const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ( !emailRegExp.test(String(e.target.value).toLowerCase()) ) {
      setEmailError('Incorrect email');
    } else {
      setEmailError('');
    }

  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);

    if ( e.target.value.length < 3 || e.target.value.length > 8 ) {
      setPasswordError('Password must be longer then 3 symbols and shorter then 8');
      if ( !e.target.value ) {
        setPasswordError('Incorrect password');

      }
    } else {
      setPasswordError('');
    }
  };

  const blurHandler = (e) => {
    switch ( e.target.name ) {
      case 'email':
        setEmailDirty(true);
        break;
      case 'password':
        setPasswordDirty(true);
        break;
    }
  };

  return (
    <div className="app">
      <form action="">
        <h1>Registration</h1>
        <input onChange={e => emailHandler(e)} value={email} onBlur={e => blurHandler(e)} name="email" type="text"
               placeholder="Enter your email..." />
        {(emailDirty && emailError) && <div style={{ color: 'red' }}>{emailError}</div>}
        <input onChange={e => passwordHandler(e)} value={password} onBlur={e => blurHandler(e)} name="password"
               type="password"
               placeholder="Enter your password" />
        {(passwordDirty && passwordError) && <div style={{ color: 'red' }}>{passwordError}</div>}
        <button disabled={ !formIsValid} type="submit">Register</button>
      </form>
    </div>
  );
}

export default App;*/

const useValidation = (value, validations) => {
  const [ isEmpty, setIsEmpty ] = useState(true);
  const [ minLengthError, setMinLengthError ] = useState(false);
  const [ emailError, setEmailError ] = useState(false);
  const [ maxLengthError, setMaxLengthError ] = useState(false);
  const [ inputValid, setInputValid ] = useState(false);

  useEffect(() => {

    for ( const validation in validations ) {
      switch ( validation ) {
        case 'isEmpty':
          value ? setIsEmpty(false) : setIsEmpty(true);
          break;
        case 'minLength':
          value.length < validations[validation] ? setMinLengthError(true) : setMinLengthError(false);
          break;
        case 'maxLength' :
          value.length > validations[validation] ? setMaxLengthError(true) : setMaxLengthError(false);
          break;
        case 'isEmail':
          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          re.test(value.toLowerCase()) ? setEmailError(false) : setEmailError(true);
          break;
      }
    }

  }, [ value ]);

  useEffect(() => {
    if ( isEmpty || minLengthError || maxLengthError || emailError ) {
      setInputValid(false);
    } else {
      setInputValid(true);

    }
  }, [ isEmpty,
    minLengthError,
    maxLengthError,
    emailError ]);

  return {
    isEmpty,
    minLengthError,
    maxLengthError,
    emailError,
    inputValid,
  };

};

const useInput = (initialValue, validations) => {
  const [ value, setValue ] = useState(initialValue);
  const [ isDirty, setIsDirty ] = useState(false);
  const valid = useValidation(value, validations);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    setIsDirty(true);
  };

  return {
    value, onChange, onBlur, isDirty, ...valid,
  };
};

function App() {
  const email = useInput('', { isEmpty: true, isEmail: false });
  const password = useInput('', { isEmpty: true, minLength: 6, maxLength: 14 });

  return (
    <div className="app">
      <div className="form">
        <form action="">
          <h1>Registration</h1>
          <input onBlur={e => email.onBlur(e)} onChange={e => email.onChange(e)} value={email.value} name="email"
                 type="text"
                 placeholder="Enter your email..." />
          {(email.isDirty && email.isEmpty) ? <div style={{ color: 'red' }}>Cannot be empty</div>
            : (email.isDirty && email.emailError) ?
              <div style={{ color: 'red' }}>Email does not exist</div>
              : null
          }
          <input onBlur={e => password.onBlur(e)} onChange={e => password.onChange(e)} value={password.value}
                 name="password"
                 type="password"
                 placeholder="Enter your password" />
          {(password.isDirty && password.isEmpty) ? <div style={{ color: 'red' }}>Cannot be empty</div>
            : (password.isDirty && password.minLengthError) ?
              <div style={{ color: 'red' }}>Password must be longer then 6 symbols</div>
              : (password.isDirty && password.maxLengthError) ?
                <div style={{ color: 'red' }}>Password must be shorter then 14 symbols</div>
                : null
          }

          <button disabled={ !email.inputValid || !password.inputValid} type="submit">Register</button>
        </form>
      </div>
    </div>
  );

}

export default App;


